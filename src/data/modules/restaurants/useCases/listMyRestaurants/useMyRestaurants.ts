import { useQuery } from '@tanstack/react-query';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';
import { RestaurantQueryKeys } from '../../keys/RestaurantKeys';

export function useMyRestaurants() {
	const { data, isLoading, isRefetching, error, refetch } = useQuery({
		queryKey: [RestaurantQueryKeys.MY_RESTAURANTS],
		queryFn: RestaurantsService.listMine
	});

	return {
		myRestaurants: data ?? [],
		isLoadingMyRestaurants: isLoading,
		isRefetchingMyRestaurants: isRefetching,
		myRestaurantsError: error,
		refetchMyRestaurants: refetch
	};
}
