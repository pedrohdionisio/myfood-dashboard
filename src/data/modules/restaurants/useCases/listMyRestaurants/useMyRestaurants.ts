import { useQuery } from '@tanstack/react-query';
import { RestaurantQueryKeys } from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';

export function useMyRestaurants() {
	const { data, isLoading, isRefetching, error, refetch } = useQuery({
		queryKey: [RestaurantQueryKeys.MY_RESTAURANTS],
		queryFn: RestaurantsService.listMine
	});

	const memberships = data ?? [];
	const ownedRestaurants = memberships.filter(({ role }) => role === 'OWNER');

	return {
		myRestaurants: ownedRestaurants,
		isDriverOnly: memberships.length > 0 && ownedRestaurants.length === 0,
		isLoadingMyRestaurants: isLoading,
		isRefetchingMyRestaurants: isRefetching,
		myRestaurantsError: error,
		refetchMyRestaurants: refetch
	};
}
