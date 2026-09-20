import { useQuery } from '@tanstack/react-query';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';
import { RestaurantQueryKeys } from '../../keys/RestaurantKeys';

export function useMyRestaurants() {
	const { data, isLoading, error } = useQuery({
		queryKey: [RestaurantQueryKeys.MY_RESTAURANTS],
		queryFn: RestaurantsService.listMyRestaurants
	});

	return {
		myRestaurants: data ?? [],
		isLoadingMyRestaurants: isLoading,
		myRestaurantsError: error
	};
}
