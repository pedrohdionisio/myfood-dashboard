import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductMutationKeys, ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';
import type { ICreateProductVariables } from 'data/modules/products/types/ProductTypes';

export function useCreateProduct() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [ProductMutationKeys.CREATE_PRODUCT],
		mutationFn: ({ restaurantId, ...payload }: ICreateProductVariables) =>
			ProductsService.createProduct(restaurantId, payload),
		async onSuccess(_product, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [ProductQueryKeys.PRODUCTS, restaurantId]
			});
		}
	});

	return {
		createProduct: mutateAsync,
		isCreatingProduct: isPending
	};
}
