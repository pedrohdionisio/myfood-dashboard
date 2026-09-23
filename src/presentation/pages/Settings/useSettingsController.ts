import { getApiErrorMessage } from 'data/config/apiError';
import { useCuisineCatalog } from 'data/modules/cuisines/useCases/listCuisineCatalog/useCuisineCatalog';
import { useRestaurantCuisines } from 'data/modules/cuisines/useCases/listRestaurantCuisines/useRestaurantCuisines';
import { useOpeningHours } from 'data/modules/openingHours/useCases/listOpeningHours/useOpeningHours';
import { useRestaurant } from 'data/modules/restaurants/useCases/getRestaurant/useRestaurant';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

export function useSettingsController() {
	const { restaurantId } = useRestaurantGate();

	const { openingHours, isLoadingOpeningHours, openingHoursError } = useOpeningHours(restaurantId);
	const { restaurant, isLoadingRestaurant, restaurantError } = useRestaurant(restaurantId);
	const { cuisineCatalog, isLoadingCuisineCatalog, cuisineCatalogError } = useCuisineCatalog();
	const { restaurantCuisines, isLoadingRestaurantCuisines, restaurantCuisinesError } =
		useRestaurantCuisines(restaurantId);

	const isLoadingCuisines = isLoadingCuisineCatalog || isLoadingRestaurantCuisines;
	const hasCuisinesError = !!cuisineCatalogError || !!restaurantCuisinesError;

	return {
		restaurantId,
		restaurant,
		openingHours,
		isLoadingOpeningHours,
		openingHoursError,
		isLoadingRestaurant,
		restaurantErrorMessage: restaurantError ? getApiErrorMessage(restaurantError) : null,
		cuisineCatalog,
		restaurantCuisines,
		isLoadingCuisines,
		hasCuisinesError,
		canEditCuisines: !isLoadingCuisines && !hasCuisinesError
	};
}
