---
paths:
  - "src/data/modules/**"
  - "src/data/contexts/SelectedRestaurantProvider/**"
---

# Dados escopados por restaurante

Fora de auth e do próprio cadastro, **toda rota da API é escopada**:
`/restaurants/:restaurantId/...`. O `restaurantId` sai sempre do restaurante selecionado, que
vive em `data/contexts/SelectedRestaurantProvider`.

## Quem resolve o escopo

O **service não conhece React**: recebe o `restaurantId` como primeiro parâmetro e pronto.

```ts
async function listMenuCategories(restaurantId: string): Promise<IMenuCategory[]> {
	const { data } = await api.get<IMenuCategory[]>(`/restaurants/${restaurantId}/menu-categories`);

	return data;
}
```

Quem resolve o escopo é o **hook do use-case**, lendo o contexto:

```ts
export function useMenuCategories() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const { data, isLoading, error } = useQuery({
		queryKey: [MenuQueryKeys.MENU_CATEGORIES, restaurantId],
		queryFn: restaurantId
			? () => MenuCategoriesService.listMenuCategories(restaurantId)
			: skipToken
	});

	return {
		menuCategories: data ?? [],
		isLoadingMenuCategories: isLoading,
		menuCategoriesError: error
	};
}
```

Assim nenhuma página precisa carregar o `restaurantId` na mão, e o dia em que houver rota com
`:restaurantId` na URL o único arquivo que muda é o provider.

## O `restaurantId` vai na queryKey — sem exceção

É a parte que não pode ser esquecida. Sem o id na key, os dados de um restaurante ficam
cacheados sob a mesma chave dos outros e **trocar de restaurante serve o cardápio do
anterior**. Com o id na key, a troca refaz as queries sozinha e o cache de cada restaurante
sobrevive separado — não precisa invalidar nada no `selectRestaurant`.

Vale para mutation também: o `onSuccess` invalida incluindo o id
(`queryKey: [MenuQueryKeys.MENU_CATEGORIES, restaurantId]`), senão limpa a chave errada.

## `skipToken`, não `enabled`

`skipToken` é do próprio react-query e mantém o `queryFn` tipado enquanto o restaurante não
resolveu. Com `enabled: !!restaurantId` o TypeScript continua vendo `string | null` dentro do
`queryFn` e sobra um `!` — que é justamente o caso que quebra se o provider mudar.

## Fechamento

`pnpm typecheck && pnpm lint`; ver `CLAUDE.md`.
