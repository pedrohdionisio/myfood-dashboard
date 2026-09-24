import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from 'data/contexts/AuthProvider/AuthProvider';
import { SelectedRestaurantProvider } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { Toaster } from 'presentation/components/Toaster/Toaster';
import { Router } from 'presentation/routes/Router';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AUTH_TOKENS_STORAGE_KEY } from 'shared/constants/storage';

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
			mutations: { retry: false }
		}
	});
}

export function seedSession() {
	localStorage.setItem(
		AUTH_TOKENS_STORAGE_KEY,
		JSON.stringify({ accessToken: 'access-token', refreshToken: 'refresh-token' })
	);
}

export function renderApp(route = '/') {
	window.history.pushState({}, '', route);

	const queryClient = createTestQueryClient();

	return {
		user: userEvent.setup(),
		queryClient,
		...render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Router />
				</AuthProvider>

				<Toaster />
			</QueryClientProvider>
		)
	};
}

export function renderSignedIn(ui: ReactNode, route = '/') {
	seedSession();

	const queryClient = createTestQueryClient();

	return {
		user: userEvent.setup(),
		queryClient,
		...render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<SelectedRestaurantProvider>
						<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
					</SelectedRestaurantProvider>
				</AuthProvider>

				<Toaster />
			</QueryClientProvider>
		)
	};
}
