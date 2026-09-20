import { useAuth } from 'data/contexts/AuthProvider';
import { Home } from 'presentation/pages/Home/Home';
import { Login } from 'presentation/pages/Login/Login';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './appRoutes';

export function Router() {
	const { signedIn } = useAuth();

	return (
		<BrowserRouter>
			<Routes>
				{signedIn ? (
					<>
						<Route path={APP_ROUTES.home} element={<Home />} />
						<Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
					</>
				) : (
					<>
						<Route path={APP_ROUTES.login} element={<Login />} />
						<Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
					</>
				)}
			</Routes>
		</BrowserRouter>
	);
}
