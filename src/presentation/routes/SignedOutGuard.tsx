import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { readRedirectPath } from './utils/readRedirectPath';

export function SignedOutGuard() {
	const { signedIn } = useAuth();
	const location = useLocation();

	if (signedIn) {
		return <Navigate to={readRedirectPath(location.state) ?? APP_ROUTES.home} replace />;
	}

	return <Outlet />;
}
