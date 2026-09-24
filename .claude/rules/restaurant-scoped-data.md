---
paths:
  - "src/data/modules/**"
  - "src/data/contexts/SelectedRestaurantProvider/**"
---

# Dados escopados por restaurante

Fora de auth e do próprio cadastro, **toda rota da API é escopada**:
`/restaurants/:restaurantId/...`. O `restaurantId` sai sempre do restaurante selecionado, que
vive em `data/contexts/SelectedRestaurantProvider`.

## O use-case não conhece o contexto

Nada em `data/modules/` lê o `SelectedRestaurantProvider`. O service recebe o `restaurantId`
como primeiro parâmetro, e o hook do use-case recebe de quem o chama:

```ts
async function list(restaurantId: string): Promise<IMenuCategory[]> {
	const { data } = await api.get<IMenuCategory[]>(`/restaurants/${restaurantId}/menu-categories`);

	return data;
}
```

```ts
export function useMenuCategories(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [MenuQueryKeys.MENU_CATEGORIES, restaurantId],
		queryFn: restaurantId
			? () => MenuCategoriesService.list(restaurantId)
			: skipToken
	});

	return {
		menuCategories: data ?? [],
		isLoadingMenuCategories: isLoading,
		menuCategoriesError: error
	};
}
```

Na mutation o id entra como **variável da mutation**, junto do payload, e o `onSuccess` lê ele
de volta do segundo argumento:

```ts
export function useReplaceOpeningHours() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [OpeningHoursMutationKeys.REPLACE_OPENING_HOURS],
		mutationFn: ({ restaurantId, ...payload }: IReplaceOpeningHoursVariables) =>
			OpeningHoursService.replace(restaurantId, payload),
		onSuccess(openingHours, { restaurantId }) {
			queryClient.setQueryData([OpeningHoursQueryKeys.OPENING_HOURS, restaurantId], openingHours);
		}
	});

	return {
		replaceOpeningHours: mutateAsync,
		isReplacingOpeningHours: isPending
	};
}
```

Quem lê o contexto é o **controller da página ou do componente** — `useSettingsController` é o
exemplo vivo. O use-case fica sem regra nenhuma dentro: nada de `if (!restaurantId) throw`,
porque isso é decisão de produto e mora na tela.

## Sem restaurante, a tela não monta

O jeito de tratar `restaurantId` nulo é **não renderizar** quem depende dele, não estourar erro
lá embaixo. O controller devolve `restaurantId: string | null`, a página condiciona o render e
o TypeScript estreita para `string` na prop:

```tsx
{restaurantId ? <OpeningHoursForm restaurantId={restaurantId} /> : null}
```

## O `restaurantId` vai na queryKey — sem exceção

É a parte que não pode ser esquecida. Sem o id na key, os dados de um restaurante ficam
cacheados sob a mesma chave dos outros e **trocar de restaurante serve o cardápio do
anterior**. Com o id na key, a troca refaz as queries sozinha e o cache de cada restaurante
sobrevive separado — não precisa invalidar nada no `selectRestaurant`.

No `mutationKey` o id não entra: lá ele não separa cache nenhum, só o estado de pending.

## `skipToken`, não `enabled`

`skipToken` é do próprio react-query e mantém o `queryFn` tipado enquanto o restaurante não
resolveu. Com `enabled: !!restaurantId` o TypeScript continua vendo `string | null` dentro do
`queryFn` e sobra um `!` — que é justamente o caso que quebra se o provider mudar.

## Fechamento

`pnpm typecheck && pnpm lint && pnpm test`; ver `CLAUDE.md`.
