import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useOpeningHours } from 'data/modules/openingHours/useCases/listOpeningHours/useOpeningHours';

export function useSettingsController() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const { openingHours, isLoadingOpeningHours, openingHoursError } = useOpeningHours(restaurantId);

	return {
		restaurantId,
		openingHours,
		isLoadingOpeningHours,
		openingHoursError,
		canManageOpeningHours: selectedRestaurant?.role === 'OWNER'
	};
}
