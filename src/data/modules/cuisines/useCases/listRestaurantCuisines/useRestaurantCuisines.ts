import { skipToken, useQuery } from '@tanstack/react-query';
import { CuisinesService } from 'data/modules/cuisines/services/CuisinesService';
import { CuisineQueryKeys } from '../../keys/CuisineKeys';

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
