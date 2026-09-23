import { ForgotPassword } from 'presentation/pages/ForgotPassword/ForgotPassword';
import { Login } from 'presentation/pages/Login/Login';
import { ResetPassword } from 'presentation/pages/ResetPassword/ResetPassword';
import { SignUp } from 'presentation/pages/SignUp/SignUp';
import { Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './appRoutes';

export function SignedOutRoutes() {
	return (
		<Routes>
			<Route path={APP_ROUTES.login} element={<Login />} />
			<Route path={APP_ROUTES.signUp} element={<SignUp />} />
			<Route path={APP_ROUTES.forgotPassword} element={<ForgotPassword />} />
			<Route path={APP_ROUTES.resetPassword} element={<ResetPassword />} />
			<Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
		</Routes>
	);
}
