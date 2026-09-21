import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { Home } from 'presentation/pages/Home/Home';
import { MenuCategories } from 'presentation/pages/MenuCategories/MenuCategories';
import { RestaurantOnboarding } from 'presentation/pages/RestaurantOnboarding/RestaurantOnboarding';
import { RestaurantSelection } from 'presentation/pages/RestaurantSelection/RestaurantSelection';
import { Settings } from 'presentation/pages/Settings/Settings';
import { DashboardTemplate } from 'presentation/templates/DashboardTemplate/DashboardTemplate';
import { Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './appRoutes';

export function SignedInRoutes() {
	const { myRestaurants, isLoadingMyRestaurants, myRestaurantsError } = useMyRestaurants();
	const { selectedRestaurant } = useSelectedRestaurant();

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

	if (!selectedRestaurant) {
		return (
			<Routes>
				<Route path={APP_ROUTES.restaurantSelection} element={<RestaurantSelection />} />
				<Route path="*" element={<Navigate to={APP_ROUTES.restaurantSelection} replace />} />
			</Routes>
		);
	}

	return (
		<Routes>
			<Route element={<DashboardTemplate />}>
				<Route path={APP_ROUTES.home} element={<Home />} />
				<Route path={APP_ROUTES.menuCategories} element={<MenuCategories />} />
				<Route path={APP_ROUTES.settings} element={<Settings />} />
			</Route>

			<Route path={APP_ROUTES.restaurantSelection} element={<RestaurantSelection />} />
			<Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
		</Routes>
	);
}
