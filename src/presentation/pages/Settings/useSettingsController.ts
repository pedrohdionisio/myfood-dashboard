import { getApiErrorMessage } from 'data/config/apiError';
import { useOpeningHours } from 'data/modules/openingHours/useCases/listOpeningHours/useOpeningHours';
import { useRestaurant } from 'data/modules/restaurants/useCases/getRestaurant/useRestaurant';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

export function useSettingsController() {
	const { restaurantId, isOwner } = useRestaurantGate();

	const { openingHours, isLoadingOpeningHours, openingHoursError } = useOpeningHours(restaurantId);
	const { restaurant, isLoadingRestaurant, restaurantError } = useRestaurant(
		isOwner ? restaurantId : null
	);

	return {
		restaurantId,
		restaurant,
		openingHours,
		isLoadingOpeningHours,
		openingHoursError,
		isLoadingRestaurant,
		restaurantErrorMessage: restaurantError ? getApiErrorMessage(restaurantError) : null,
		canManageOpeningHours: isOwner,
		isOwner
	};
}
