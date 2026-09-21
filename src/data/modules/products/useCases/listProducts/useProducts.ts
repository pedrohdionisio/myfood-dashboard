import { skipToken, useQuery } from '@tanstack/react-query';
import { ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';

export function useProducts(restaurantId: string | null, menuCategoryId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [ProductQueryKeys.PRODUCTS, restaurantId, menuCategoryId],
		queryFn:
			restaurantId && menuCategoryId
				? () => ProductsService.list(restaurantId, menuCategoryId)
				: skipToken
	});

	return {
		products: data ?? [],
		isLoadingProducts: isLoading,
		productsError: error
	};
}
