import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductMutationKeys, ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';
import type { IReorderProductsVariables } from 'data/modules/products/types/ProductTypes';

export function useReorderProducts() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [ProductMutationKeys.REORDER_PRODUCTS],
		mutationFn: ({ restaurantId, ...payload }: IReorderProductsVariables) =>
			ProductsService.reorder(restaurantId, payload),
		onSuccess(products, { restaurantId, menuCategoryId }) {
			queryClient.setQueryData([ProductQueryKeys.PRODUCTS, restaurantId, menuCategoryId], products);
		}
	});

	return {
		reorderProducts: mutateAsync,
		isReorderingProducts: isPending
	};
}
