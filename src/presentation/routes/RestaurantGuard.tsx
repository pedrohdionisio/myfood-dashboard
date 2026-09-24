import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { DriverAccessNotice } from 'presentation/pages/DriverAccessNotice/DriverAccessNotice';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';

export function RestaurantGuard() {
	const { myRestaurants, isDriverOnly, isLoadingMyRestaurants, myRestaurantsError } =
		useMyRestaurants();
	const { selectedRestaurant } = useSelectedRestaurant();
	const { pathname } = useLocation();

	if (isLoadingMyRestaurants) {
		return null;
	}

	if (isDriverOnly) {
		return <DriverAccessNotice />;
	}

	if (!myRestaurantsError && myRestaurants.length === 0) {
		return pathname === APP_ROUTES.restaurantOnboarding ? (
			<Outlet />
		) : (
			<Navigate to={APP_ROUTES.restaurantOnboarding} replace />
		);
	}

	if (pathname === APP_ROUTES.restaurantOnboarding) {
		return <Navigate to={APP_ROUTES.home} replace />;
	}

	if (!selectedRestaurant) {
		return pathname === APP_ROUTES.restaurantSelection ? (
			<Outlet />
		) : (
			<Navigate to={APP_ROUTES.restaurantSelection} replace />
		);
	}

	return <Outlet />;
}
