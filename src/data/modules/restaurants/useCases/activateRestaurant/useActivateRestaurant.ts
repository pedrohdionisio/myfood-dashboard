import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	RestaurantMutationKeys,
	RestaurantQueryKeys
} from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';

export function useActivateRestaurant() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [RestaurantMutationKeys.ACTIVATE_RESTAURANT],
		mutationFn: RestaurantsService.activate,
		async onSuccess(_restaurant, restaurantId) {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [RestaurantQueryKeys.MY_RESTAURANTS] }),
				queryClient.invalidateQueries({
					queryKey: [RestaurantQueryKeys.ACTIVATION_CHECKLIST, restaurantId]
				})
			]);
		}
	});

	return {
		activateRestaurant: mutateAsync,
		isActivatingRestaurant: isPending
	};
}
