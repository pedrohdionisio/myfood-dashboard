import { getApiErrorMessage } from 'data/config/apiError';
import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';

export function useRestaurantSelectionController() {
	const { myRestaurants, isRefetchingMyRestaurants, myRestaurantsError, refetchMyRestaurants } =
		useMyRestaurants();
	const { signOut } = useAuth();
	const { selectRestaurant } = useSelectedRestaurant();
	const navigate = useNavigate();

	function handleSelectRestaurant(restaurantId: string) {
		selectRestaurant(restaurantId);
		navigate(APP_ROUTES.home);
	}

	function handleRetry() {
		refetchMyRestaurants();
	}

	return {
		myRestaurants,
		isRefetchingMyRestaurants,
		errorMessage: myRestaurantsError ? getApiErrorMessage(myRestaurantsError) : null,
		handleSelectRestaurant,
		handleRetry,
		handleSignOut: signOut
	};
}
