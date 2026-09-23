import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { resolveRestaurantGate } from 'shared/utils/resolveRestaurantGate';

export function useRestaurantGate() {
	const { selectedRestaurant } = useSelectedRestaurant();

	return {
		restaurantId: selectedRestaurant?.restaurantId ?? null,
		restaurantGate: resolveRestaurantGate(selectedRestaurant?.restaurantStatus)
	};
}
