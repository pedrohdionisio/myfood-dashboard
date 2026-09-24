import * as Sentry from '@sentry/react';
import { env } from 'data/config/env';
import { useEffect } from 'react';
import {
	createBrowserRouter,
	createRoutesFromChildren,
	matchRoutes,
	type RouteObject,
	useLocation,
	useNavigationType
} from 'react-router-dom';

function init() {
	if (!env.sentryDsn) {
		return;
	}

	Sentry.init({
		dsn: env.sentryDsn,
		environment: env.mode,
		integrations: [
			Sentry.reactRouterV7BrowserTracingIntegration({
				useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes
			})
		],
		tracesSampleRate: 0.2,
		tracePropagationTargets: [env.apiUrl]
	});
}

function captureException(error: unknown) {
	Sentry.captureException(error);
}

function createRouter(routes: RouteObject[]) {
	return Sentry.wrapCreateBrowserRouterV7(createBrowserRouter)(routes);
}

function identify(userId: string | null) {
	Sentry.setUser(userId ? { id: userId } : null);
}

export const Monitoring = {
	init,
	captureException,
	identify,
	createRouter,
	ErrorBoundary: Sentry.ErrorBoundary
};
