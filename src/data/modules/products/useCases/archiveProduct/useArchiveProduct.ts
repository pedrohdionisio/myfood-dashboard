import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductMutationKeys, ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';
import type { IArchiveProductVariables } from 'data/modules/products/types/ProductTypes';

export function useArchiveProduct() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [ProductMutationKeys.ARCHIVE_PRODUCT],
		mutationFn: ({ restaurantId, productId }: IArchiveProductVariables) =>
			ProductsService.archiveProduct(restaurantId, productId),
		async onSuccess(_product, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [ProductQueryKeys.PRODUCTS, restaurantId]
			});
		}
	});

	return {
		archiveProduct: mutateAsync,
		isArchivingProduct: isPending
	};
}
