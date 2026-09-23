import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMyRestaurants } from 'data/modules/restaurants/useCases/listMyRestaurants/useMyRestaurants';
import { DriverAccessNotice } from 'presentation/pages/DriverAccessNotice/DriverAccessNotice';
import { Drivers } from 'presentation/pages/Drivers/Drivers';
import { Home } from 'presentation/pages/Home/Home';
import { MenuCategories } from 'presentation/pages/MenuCategories/MenuCategories';
import { Orders } from 'presentation/pages/Orders/Orders';
import { OrdersHistory } from 'presentation/pages/OrdersHistory/OrdersHistory';
import { Products } from 'presentation/pages/Products/Products';
import { RestaurantOnboarding } from 'presentation/pages/RestaurantOnboarding/RestaurantOnboarding';
import { RestaurantSelection } from 'presentation/pages/RestaurantSelection/RestaurantSelection';
import { Reviews } from 'presentation/pages/Reviews/Reviews';
import { Settings } from 'presentation/pages/Settings/Settings';
import { DashboardTemplate } from 'presentation/templates/DashboardTemplate/DashboardTemplate';
import { Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './appRoutes';

export function SignedInRoutes() {
	const { myRestaurants, isDriverOnly, isLoadingMyRestaurants, myRestaurantsError } =
		useMyRestaurants();
	const { selectedRestaurant } = useSelectedRestaurant();

	if (isLoadingMyRestaurants) {
		return null;
	}

	if (isDriverOnly) {
		return (
			<Routes>
				<Route path="*" element={<DriverAccessNotice />} />
			</Routes>
		);
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
				<Route path={APP_ROUTES.orders} element={<Orders />} />
				<Route path={APP_ROUTES.ordersHistory} element={<OrdersHistory />} />
				<Route path={APP_ROUTES.reviews} element={<Reviews />} />
				<Route path={APP_ROUTES.menuCategories} element={<MenuCategories />} />
				<Route path={APP_ROUTES.products} element={<Products />} />
				<Route path={APP_ROUTES.drivers} element={<Drivers />} />
				<Route path={APP_ROUTES.settings} element={<Settings />} />
			</Route>

			<Route path={APP_ROUTES.restaurantSelection} element={<RestaurantSelection />} />
			<Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
		</Routes>
	);
}
