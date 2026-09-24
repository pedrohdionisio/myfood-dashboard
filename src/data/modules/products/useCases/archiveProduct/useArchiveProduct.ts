import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductMutationKeys, ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';
import type { IArchiveProductVariables } from 'data/modules/products/types/ProductTypes';
import { RestaurantQueryKeys } from 'data/modules/restaurants/keys/RestaurantKeys';

export function useArchiveProduct() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [ProductMutationKeys.ARCHIVE_PRODUCT],
		mutationFn: ({ restaurantId, productId }: IArchiveProductVariables) =>
			ProductsService.archive(restaurantId, productId),
		async onSuccess(_product, { restaurantId }) {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [ProductQueryKeys.PRODUCTS, restaurantId] }),
				queryClient.invalidateQueries({
					queryKey: [RestaurantQueryKeys.ACTIVATION_CHECKLIST, restaurantId]
				})
			]);
		}
	});

	return {
		archiveProduct: mutateAsync,
		isArchivingProduct: isPending
	};
}
