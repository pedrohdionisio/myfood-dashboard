import { skipToken, useQuery } from '@tanstack/react-query';
import { CuisineQueryKeys } from 'data/modules/cuisines/keys/CuisineKeys';
import { CuisinesService } from 'data/modules/cuisines/services/CuisinesService';

export function useRestaurantCuisines(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [CuisineQueryKeys.RESTAURANT_CUISINES, restaurantId],
		queryFn: restaurantId ? () => CuisinesService.listByRestaurant(restaurantId) : skipToken
	});

	return {
		restaurantCuisines: data ?? [],
		isLoadingRestaurantCuisines: isLoading,
		restaurantCuisinesError: error
	};
}
