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

| Comando          | O que faz                                 |
| ---------------- | ----------------------------------------- |
| `pnpm typecheck` | Só o TypeScript (`tsc -b`)                |
| `pnpm lint`      | `biome check`                             |
| `pnpm format`    | `biome check --write` (corrige e formata)  |
| `pnpm dev`       | Dev server — **só se pedido**             |
| `pnpm build`     | `tsc -b` + produção — **só se pedido**    |

Husky + lint-staged rodam `biome check --error-on-warnings` e `tsc -b` no pre-commit — código
que não passa nesses dois não entra. Warning barra o commit igual a error.

## Arquitetura

Três camadas no topo de `src/`, cada uma com alias próprio:

| Camada          | Alias            | Responsabilidade                                                     |
| --------------- | ---------------- | -------------------------------------------------------------------- |
| `data/`         | `data/*`         | Só dados e mundo externo: endpoints, clients, DTOs, mappers, storage  |
| `presentation/` | `presentation/*` | Componentes, páginas e a lógica deles                                |
| `shared/`       | `shared/*`       | Utilitários, rotas, constantes, modelos e hooks compartilhados        |

Entre camadas ou pastas diferentes, use o alias (`import { x } from 'shared/x'`). Dentro da
mesma pasta, caminho relativo (`./ExampleTypes`).

Ao mexer em alias, lembre que ele vive em **três arquivos que precisam ficar em sincronia**:
`paths` no `tsconfig.app.json` (resolve os tipos), `resolve.alias` no `vite.config.ts` (resolve
o bundle) e uma cópia dos `paths` no `tsconfig.json` — essa terceira é inerte para o build e
existe só porque o CLI do shadcn lê os paths do `tsconfig.json`.

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

Código, nomes de arquivo e identificadores em **inglês**. Texto de UI e mensagens de commit em
**português**.
