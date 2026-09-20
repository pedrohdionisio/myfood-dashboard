import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { Home } from 'presentation/pages/Home/Home';
import { RestaurantOnboarding } from 'presentation/pages/RestaurantOnboarding/RestaurantOnboarding';
import { Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './appRoutes';

export function SignedInRoutes() {
	const { myRestaurants, isLoadingMyRestaurants, myRestaurantsError } = useMyRestaurants();

	if (isLoadingMyRestaurants) {
		return null;
	}

	const isOnboardingPending = !myRestaurantsError && myRestaurants.length === 0;

	if (isOnboardingPending) {
		return (
			<Routes>
				<Route path={APP_ROUTES.restaurantOnboarding} element={<RestaurantOnboarding />} />
				<Route path="*" element={<Navigate to={APP_ROUTES.restaurantOnboarding} replace />} />
			</Routes>
		);
	}

	return (
		<Routes>
			<Route path={APP_ROUTES.home} element={<Home />} />
			<Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
		</Routes>
	);
}
