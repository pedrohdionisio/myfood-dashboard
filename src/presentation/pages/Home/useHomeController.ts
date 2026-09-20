import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';

export function useHomeController() {
	const { user } = useAuth();
	const { selectedRestaurant } = useSelectedRestaurant();

	return {
		userName: user?.name ?? '',
		isRestaurantDraft: selectedRestaurant?.restaurantStatus === 'DRAFT'
	};
}
