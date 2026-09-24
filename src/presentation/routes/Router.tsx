import { Monitoring } from 'data/libs/Monitoring';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';

export function Router() {
	const [router] = useState(() => Monitoring.createRouter(routes));

	return <RouterProvider router={router} />;
}
