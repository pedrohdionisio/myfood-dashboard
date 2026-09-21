import { skipToken, useQuery } from '@tanstack/react-query';
import { RestaurantQueryKeys } from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';

export function useRestaurant(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [RestaurantQueryKeys.RESTAURANT, restaurantId],
		queryFn: restaurantId ? () => RestaurantsService.get(restaurantId) : skipToken
	});

	return {
		restaurant: data ?? null,
		isLoadingRestaurant: isLoading,
		restaurantError: error
	};
}
