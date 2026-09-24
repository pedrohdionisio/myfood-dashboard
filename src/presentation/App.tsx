import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from 'data/config/queryClient';
import { AuthProvider } from 'data/contexts/AuthProvider/AuthProvider';
import { Monitoring } from 'data/libs/Monitoring';
import { Toaster } from 'presentation/components/Toaster/Toaster';
import { AppError } from 'presentation/pages/AppError/AppError';
import { Router } from 'presentation/routes/Router';

export function App() {
	return (
		<Monitoring.ErrorBoundary fallback={({ error }) => <AppError error={error} />}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Router />
				</AuthProvider>

				<Toaster />

				<ReactQueryDevtools buttonPosition="bottom-right" />
			</QueryClientProvider>
		</Monitoring.ErrorBoundary>
	);
}
