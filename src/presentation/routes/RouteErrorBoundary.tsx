import { Monitoring } from 'data/libs/Monitoring';
import { AppError } from 'presentation/pages/AppError/AppError';
import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

export function RouteErrorBoundary() {
	const error = useRouteError();

	useEffect(() => {
		Monitoring.captureException(error);
	}, [error]);

	return <AppError error={error} />;
}
