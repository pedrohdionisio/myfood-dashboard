import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from 'data/config/queryClient';
import { AuthProvider } from 'data/contexts/AuthProvider/AuthProvider';
import { Toaster } from 'presentation/components/Toaster/Toaster';
import { AppError } from 'presentation/pages/AppError/AppError';
import { Router } from 'presentation/routes/Router';
import { ErrorBoundary } from 'react-error-boundary';

export function App() {
	return (
		<ErrorBoundary FallbackComponent={AppError}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Router />
				</AuthProvider>

				<Toaster />

				<ReactQueryDevtools buttonPosition="bottom-right" />
			</QueryClientProvider>
		</ErrorBoundary>
	);
}
