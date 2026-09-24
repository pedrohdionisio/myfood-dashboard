---
paths:
  - "components.json"
  - ".claude/scripts/normalize-shadcn.mjs"
  - "src/presentation/components/**"
---

# shadcn

O CLI do shadcn escreve no estilo dele — arquivo solto em minúsculo, tipo inline, cva no meio
do `.tsx`. Nada disso entra no projeto como veio: todo componente instalado é normalizado
para o mesmo formato dos nossos.

## Instalando

```bash
pnpm dlx shadcn@latest add <componente>
```

O `components.json` aponta os aliases para os deste projeto (não existe `@/*` aqui):
`ui` e `components` → `presentation/components`, `lib` → `shared`, `hooks` → `shared/hooks`.

Os `paths` que o CLI usa para achar essas pastas ele lê do `tsconfig.json` — a cópia inerte que
existe lá só por causa disso. Se ela sumir, o componente vai parar na raiz do repositório.

`cn` é o pacote do próprio shadcn (substitui `clsx` + `tailwind-merge`), então
`import { cn } from 'cn'` já sai correto e não é reescrito.

## O que roda sozinho

O hook `PostToolUse` em `.claude/settings.json` chama
`.claude/scripts/normalize-shadcn.mjs` depois de qualquer comando que mencione `shadcn`.
O script faz só o mecânico: move `button.tsx` → `Button/Button.tsx` (e esvazia `ui/` se o
CLI tiver criado) e roda o Biome.

Instalou pelo seu terminal, fora do Claude? O hook não dispara. Rode na mão:
`node .claude/scripts/normalize-shadcn.mjs`.

## O que sobra para o Claude

O script devolve um aviso pedindo estes ajustes. Eles dependem de ler o componente:

```
Button/
├── Button.tsx            # só JSX
├── ButtonTypes.ts        # IButtonProps
└── buttonVariants.ts     # o cva, quando o componente tem variantes
```

1. **Tipos para `<Nome>Types.ts`, só quando o tipo acrescenta algo.** As props que o CLI
   declara inline viram interface com prefixo `I` **se houver prop própria**:

   ```ts
   import type { VariantProps } from 'class-variance-authority';
   import type { ComponentProps } from 'react';
   import type { buttonVariants } from './buttonVariants';

   export interface IButtonProps
   	extends ComponentProps<'button'>,
   		VariantProps<typeof buttonVariants> {
   	asChild?: boolean;
   }
   ```

   Quando o tipo é só repasse — `ComponentProps<'div'>`, `ComponentProps<typeof Primitive.Root>`
   —, a interface ficaria vazia e não paga o próprio custo: deixe **inline na assinatura** e
   não crie o `<Nome>Types.ts`. Um componente como o `Sidebar`, que exporta dezenas de peças,
   tem umas poucas com prop de verdade (`asChild`, `isActive`, `tooltip`) e todo o resto
   inline.

2. **cva para `<nome>Variants.ts`.** Fica em arquivo próprio porque `<Nome>Types.ts`
   precisa dele (`VariantProps<typeof buttonVariants>`) e `<Nome>.tsx` também — deixar no
   `.tsx` faria os dois se importarem em círculo. É constante de estilo, não componente,
   então o nome começa em minúsculo.

3. **`export function <Nome>`,** props desestruturadas na assinatura, tipadas por
   `I<Nome>Props`. Sem `React.FC`, sem `forwardRef` novo (React 19 passa `ref` por prop).

4. **Import por alias** entre pastas (`presentation/components/Button/Button`), relativo
   dentro da pasta (`./buttonVariants`).

Este projeto **tem dark mode** por classe `.dark` (tokens em `src/index.css`), então as
classes `dark:` que o CLI trouxer ficam. Não existe escala tipográfica custom aqui — `text-sm`
e `text-xs` do Tailwind ficam como vieram.

Não mexa no comportamento: `data-slot`, props do Radix, `aria-*` e estados de foco ficam
como o shadcn entregou. A normalização é de forma, não de função.

## Quando o lint não deixa a função passar

A exceção é quando o componente **não passa no `pnpm lint` como o CLI entrega** — aí não há o
que preservar, e a mudança de comportamento é obrigatória. Aconteceu uma vez, com o `chart`:

| O que o CLI trouxe                            | Regra que barra                       |
| --------------------------------------------- | ------------------------------------- |
| `dangerouslySetInnerHTML` no `ChartStyle`      | `security/noDangerouslySetInnerHtml`  |
| `key={index}` no tooltip e na legenda          | `suspicious/noArrayIndexKey`          |

O `ChartStyle` saiu inteiro, junto do `THEMES`. Ele existe para injetar `--color-<serie>` por
tema, e **aqui isso não tem serventia**: os tokens `--chart-1..5` do `src/index.css` já viram
no `.dark` sozinhos. A cor vai do `config` direto para o `stroke`/`fill` do recharts.

A consequência é que `fill="var(--color-minhaSerie)"`, que os exemplos do shadcn usam, **não
funciona neste projeto** — a var nunca é declarada. Referencie o config:

```tsx
const REVENUE_CHART_CONFIG = {
	grossRevenueCents: { label: 'Receita bruta', color: 'var(--chart-1)' }
} satisfies ChartConfig;

<Area dataKey="grossRevenueCents" stroke={REVENUE_CHART_CONFIG.grossRevenueCents.color} />;
```

As keys passaram a sair do `dataKey` da série, que é estável e não muda de ordem.

O `ChartTooltipContent` também ganhou um `valueFormatter?: (value: number) => string`, que não
é do shadcn. Sem ele o tooltip imprime centavos crus (`123456`), e o `formatter` que o shadcn
oferece substitui a **linha inteira** — formatar o valor por ali significaria repetir o
indicador e o label em cada gráfico.

Reinstalar o `chart` pelo CLI traz o `ChartStyle` de volta e quebra o lint de novo. É refazer
as duas remoções e devolver o `valueFormatter`.

## Fechamento

`pnpm typecheck && pnpm lint && pnpm test`. Nunca `pnpm build` nem `pnpm dev`; ver `CLAUDE.md`.

O `Button` já normalizado é a referência viva: `src/presentation/components/Button/`. Para o
caso em que o lint obrigou a mexer na função, é o `Chart/`.
