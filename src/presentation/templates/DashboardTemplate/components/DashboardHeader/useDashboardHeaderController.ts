import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';

export function useDashboardHeaderController() {
	const { user, signOut } = useAuth();
	const { myRestaurants } = useMyRestaurants();
	const { selectedRestaurant } = useSelectedRestaurant();

	return {
		userName: user?.name ?? '',
		restaurantName: selectedRestaurant?.tradeName ?? '',
		canSwitchRestaurant: myRestaurants.length > 1,
		handleSignOut: signOut
	};
}
