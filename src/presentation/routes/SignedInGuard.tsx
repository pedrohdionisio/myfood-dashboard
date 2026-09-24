import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { SelectedRestaurantProvider } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { RestaurantGuard } from './RestaurantGuard';

export function SignedInGuard() {
	const { signedIn } = useAuth();
	const { pathname, search } = useLocation();

	if (!signedIn) {
		return <Navigate to={APP_ROUTES.login} replace state={{ from: `${pathname}${search}` }} />;
	}

	return (
		<SelectedRestaurantProvider>
			<RestaurantGuard />
		</SelectedRestaurantProvider>
	);
}
