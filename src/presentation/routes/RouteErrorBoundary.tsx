import { AppError } from 'presentation/pages/AppError/AppError';
import { useRouteError } from 'react-router-dom';

export function RouteErrorBoundary() {
	return <AppError error={useRouteError()} />;
}
