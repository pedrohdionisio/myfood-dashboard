import { Login } from 'presentation/pages/Login/Login';
import { SignUp } from 'presentation/pages/SignUp/SignUp';
import { Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './appRoutes';

export function SignedOutRoutes() {
	return (
		<Routes>
			<Route path={APP_ROUTES.login} element={<Login />} />
			<Route path={APP_ROUTES.signUp} element={<SignUp />} />
			<Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
		</Routes>
	);
}
