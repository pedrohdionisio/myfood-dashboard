# MyFood Dashboard

React 19 + Vite 8 + TypeScript, Tailwind v4 com tokens shadcn, Biome para lint/format.
Gerenciador de pacotes é **pnpm**.

## Verificação — regra que não se negocia

**Depois de qualquer alteração, rode apenas estes dois:**

```bash
pnpm typecheck && pnpm lint
```

**NUNCA rode `pnpm build` nem suba o dev server (`pnpm dev`, `vite`, `pnpm preview`) sem o
Pedro pedir explicitamente.** Não é "preferência": build e servidor só rodam quando pedidos,
por mais que pareçam a forma óbvia de confirmar que algo funciona. `typecheck` + `lint` é o
fechamento padrão — é o mesmo par que o pre-commit roda, então passar neles é o que define
"pronto".

Pedido explícito é o Pedro escrevendo que quer (`roda o build`, `sobe o servidor`,
`quer ver no browser`). Achar que seria útil não conta; se você julga que o build é necessário
para provar algo, pergunte em vez de rodar.

## Comandos

| Comando              | O que faz                                           |
| -------------------- | --------------------------------------------------- |
| `pnpm typecheck`     | Só o TypeScript (`tsc -b`)                          |
| `pnpm lint`          | `biome check`                                       |
| `pnpm format`        | `biome check --write` (corrige e formata)           |
| `pnpm dev`           | Dev server — **só se pedido**                       |
| `pnpm build`         | `tsc -b` + produção — **só se pedido**              |
| `pnpm test`          | Vitest: unitários e de feature                      |
| `pnpm test:coverage` | Vitest com cobertura e mínimo exigido               |
| `pnpm test:e2e`      | Playwright — sobe build + preview, **só se pedido** |

Husky + lint-staged rodam `biome check --error-on-warnings` e `tsc -b` no pre-commit — código
que não passa nesses dois não entra. Warning barra o commit igual a error.

## Arquitetura

Três camadas no topo de `src/`, cada uma com alias próprio:

| Camada          | Alias            | Responsabilidade                                                       |
| --------------- | ---------------- | ---------------------------------------------------------------------- |
| `data/`         | `data/*`         | Só dados e mundo externo: endpoints, clients, DTOs, mappers, storage    |
| `presentation/` | `presentation/*` | Componentes, páginas, a lógica deles e os routers                      |
| `shared/`       | `shared/*`       | Utilitários, paths de rota, constantes, modelos e hooks compartilhados |

`shared/` é a base: não importa de `data/` nem de `presentation/`. Entre camadas ou pastas
diferentes, use o alias (`import { x } from 'shared/x'`). Dentro da pasta do próprio componente —
incluindo o `utils/` e o `hooks/` dele —, caminho relativo (`./ExampleTypes`, `../ExampleTypes`).
Componente irmão já é outra pasta: `presentation/pages/Orders/components/OrderCard/OrderCard`, não
`../OrderCard/OrderCard`.

Ao mexer em alias, lembre que ele vive em **três arquivos que precisam ficar em sincronia**:
`paths` no `tsconfig.app.json` (resolve os tipos), `resolve.alias` no `vite.config.ts` (resolve
o bundle) e uma cópia dos `paths` no `tsconfig.json` — essa terceira é inerte para o build e
existe só porque o CLI do shadcn lê os paths do `tsconfig.json`.

### Função de uso local sai do arquivo

Função utilitária ou hook que só aquele componente/página usa não fica no meio do arquivo: vai
para `utils/<nomeDaFuncao>.ts` ou `hooks/<useNome>.ts` **dentro da pasta do próprio
componente/página**, importada de lá (`./utils/toFormValues`). No dia em que servir mais de uma
pasta, sobe para `shared/utils` ou `shared/hooks`.

Sem exagero: a regra é sobre função. Constante fica onde está — a não ser que exista só para
aquela função, e aí desce junto com ela.

### Imagem de produto: o 4:3 e o 1280 vêm da API

O `ImageInput` exporta a foto do produto em **1280×960 WebP** (JPEG no navegador que não codifica
WebP no canvas, como o Safari), e nenhum dos dois números é escolha de layout. `1280` é a largura da variante `lg` em `IMAGE_VARIANTS`
(`myfood-api/src/domain/images.ts`). O 4:3 é nosso, mas vira contrato porque o sharp lá
redimensiona **só por largura** (`resize({ width, withoutEnlargement: true })`) e nunca corta —
a proporção que sobe é a proporção que o cliente vê no cardápio.

Mexer em um lado só falha calado. Abaixo de 1280, o `withoutEnlargement` não amplia: o `lg` sai
menor que o esperado e borra. Acima, o sharp joga o excedente fora e o byte extra só encareceu o
upload. Mudou `IMAGE_VARIANTS` na API, mude o `outputWidth` em
`presentation/pages/Products/components/ProductFormModal/ProductFormModal.tsx`.

### Onde mora o schema

Schema de um use case só fica em `data/modules/<modulo>/useCases/<useCase>/schemas/`. Quando mais de
um use case usa — criar e editar produto, por exemplo —, ele sobe para `data/modules/<modulo>/schemas/`.

### Método de service não repete o nome do service

O objeto já diz de que entidade se trata, então o método só carrega o verbo:
`ProductsService.create()`, não `ProductsService.createProduct()`. O nome completo aparece uma
vez na chamada e repetir vira ruído.

```ts
ProductsService.list(restaurantId, menuCategoryId);
ProductsService.setAvailability(restaurantId, productId, isAvailable);
MenuCategoriesService.reorder(restaurantId, payload);
RestaurantsService.listMine();
```

**O qualificador volta quando sem ele o nome fica ambíguo ou colide.** Se um dia o
`ProductsService` também mexer em categoria, aí é `createCategory` — porque `create` sozinho
não diria mais o quê. Mesma lógica para `AddressService.findByZipCode`: `find` sozinho não diz
por onde se busca, então `ByZipCode` fica.

Verbo que não repete o nome do service já está certo e não muda: `AuthService.login()`,
`AuthService.refreshToken()`, `AuthService.getMe()`.

A regra é do método do service. O hook do use case continua com o nome inteiro
(`useCreateProduct`), porque ele é importado solto e `useCreate` não diria nada.

## Testes

- **Unitário** é `*.test.ts` ao lado do arquivo testado e roda em node: função pura, schema,
  parser.
- **Feature** é `*.test.tsx` ao lado da página ou do componente e roda em jsdom, com a API mockada
  pelo MSW. Renderize com `renderSignedIn` (página com sessão e restaurante) ou `renderApp` (app
  inteiro, pelo router) de `tests/render.tsx`. Os handlers padrão ficam em `tests/handlers.ts`; o
  teste sobrescreve só o que importa com `server.use`. Request sem handler quebra o teste.
- **E2E** fica em `e2e/`, com a API mockada por `page.route` em `e2e/support/mockApi.ts`, rodando
  em Chromium e WebKit. As fixtures de `tests/fixtures/` servem aos dois.
- Selecione pelo que o usuário vê: `getByRole`, `getByLabelText`, texto. Nada de `data-testid`.

## Regras por contexto

As regras detalhadas ficam em `.claude/rules/`. Elas carregam sozinhas quando você **lê** um
arquivo que casa com o `paths` delas — mas ao **criar arquivo novo** esse gatilho não dispara.

| Vou mexer em…                  | Leia                        |
| ------------------------------ | --------------------------- |
| Instalar componente do shadcn  | `.claude/rules/shadcn.md`   |

## Formatação

Definida no Biome + `.editorconfig`, aplicada pelo pre-commit. Não discuta com o formatter —
rode `pnpm format`.

- Indentação com **tab** (JSON, YAML e Markdown com 2 espaços), largura de linha 100.
- Aspas simples, ponto e vírgula sempre, sem trailing comma.
- `export function Nome()` — sem `export default`, sem arrow function para componentes.
- **Função é declarada, não atribuída.** No corpo do arquivo é `function x() {}`, nunca
  `const x = () => {}`. Arrow function só como argumento — callback de `.map`, de hook, de
  evento.
- **Só renomeie o que é nosso.** Nome de função de lib fica como a lib batizou: nada de
  `handleSubmit: submitForm` na desestruturação. Quem ganha nome novo é a nossa função — o
  submit do formulário é `onSubmit`, e ele entra no `handleSubmit` do react-hook-form:
  `handleSubmit: handleSubmit(onSubmit)`.
- Toda interface começa com `I`.

## Comentários

**Não escreva comentário nenhum** — nem no `.tsx`, nem no `.css`, nem em config (incluindo os
`tsconfig*.json`), nem em script. Nome de variável, de função e de arquivo carregam a intenção.

Quando algo precisa de explicação, ela vai **na conversa com o Pedro**, não no arquivo. Se for
conhecimento que precisa durar, o lugar é este `CLAUDE.md` ou `.claude/rules/` — nunca um
comentário. Ele adiciona comentário por conta própria quando achar pertinente; isso é decisão
dele, não sua.

Se algo só se entende com comentário, o código é que precisa mudar.

## Idioma

Código, nomes de arquivo e identificadores em **inglês**. Texto de UI em **português**.

Commit **sempre em inglês**, em Conventional Commits, numa linha só e com o verbo na terceira pessoa
do presente: `feat: implements team management`, `fix: fixes zip code lookup on settings`,
`chore: creates ci workflow`. Nada de imperativo (`implement`, `fix`) nem de corpo além do
`Co-Authored-By`.

Erro lançado com `throw` segue a mesma divisão: se a mensagem chega à tela (o `cropImage` vira
aviso no `ImageInput`), português; se é invariante interna (hook fora do provider, env faltando),
inglês.
