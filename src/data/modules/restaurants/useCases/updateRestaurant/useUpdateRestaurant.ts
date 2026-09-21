import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	RestaurantMutationKeys,
	RestaurantQueryKeys
} from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';
import type { IUpdateRestaurantVariables } from 'data/modules/restaurants/types/RestaurantTypes';

export function useUpdateRestaurant() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [RestaurantMutationKeys.UPDATE_RESTAURANT],
		mutationFn: ({ restaurantId, ...payload }: IUpdateRestaurantVariables) =>
			RestaurantsService.update(restaurantId, payload),
		async onSuccess(restaurant, { restaurantId }) {
			queryClient.setQueryData([RestaurantQueryKeys.RESTAURANT, restaurantId], restaurant);

			await queryClient.invalidateQueries({ queryKey: [RestaurantQueryKeys.MY_RESTAURANTS] });
		}
	});

	return {
		updateRestaurant: mutateAsync,
		isUpdatingRestaurant: isPending
	};
}
