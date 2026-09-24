import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductMutationKeys, ProductQueryKeys } from 'data/modules/products/keys/ProductKeys';
import { ProductsService } from 'data/modules/products/services/ProductsService';
import type { ISetProductAvailabilityVariables } from 'data/modules/products/types/ProductTypes';
import { RestaurantQueryKeys } from 'data/modules/restaurants/keys/RestaurantKeys';
import type { IProduct } from 'shared/entities/IProduct';

export function useSetProductAvailability() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, variables } = useMutation({
		mutationKey: [ProductMutationKeys.SET_PRODUCT_AVAILABILITY],
		mutationFn: ({ restaurantId, productId, isAvailable }: ISetProductAvailabilityVariables) =>
			ProductsService.setAvailability(restaurantId, productId, isAvailable),
		async onSuccess(product, { restaurantId }) {
			queryClient.setQueryData<IProduct[]>(
				[ProductQueryKeys.PRODUCTS, restaurantId, product.menuCategoryId],
				(current) => current?.map((item) => (item.id === product.id ? product : item))
			);

			await queryClient.invalidateQueries({
				queryKey: [RestaurantQueryKeys.ACTIVATION_CHECKLIST, restaurantId]
			});
		}
	});

	return {
		setProductAvailability: mutateAsync,
		togglingProductId: isPending && variables ? variables.productId : null
	};
}
