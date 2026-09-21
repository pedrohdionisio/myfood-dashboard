import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { resolveRestaurantGate } from 'shared/utils/resolveRestaurantGate';

export function useRestaurantGate() {
	const { selectedRestaurant } = useSelectedRestaurant();

	const isOwner = selectedRestaurant?.role === 'OWNER';

	return {
		restaurantId: selectedRestaurant?.restaurantId ?? null,
		isOwner,
		restaurantGate: resolveRestaurantGate(selectedRestaurant?.restaurantStatus, isOwner)
	};
}
