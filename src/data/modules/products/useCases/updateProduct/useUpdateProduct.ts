import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductMutationKeys, ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';
import type { IUpdateProductVariables } from 'data/modules/products/types/ProductTypes';

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [ProductMutationKeys.UPDATE_PRODUCT],
		mutationFn: ({ restaurantId, productId, ...payload }: IUpdateProductVariables) =>
			ProductsService.updateProduct(restaurantId, productId, payload),
		async onSuccess(_product, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [ProductQueryKeys.PRODUCTS, restaurantId]
			});
		}
	});

	return {
		updateProduct: mutateAsync,
		isUpdatingProduct: isPending
	};
}
