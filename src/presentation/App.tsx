import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from 'data/config/queryClient';
import { AuthProvider } from 'data/contexts/AuthProvider/AuthProvider';
import { Toaster } from 'presentation/components/Toaster/Toaster';
import { Router } from 'shared/routes/Router';

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Router />
			</AuthProvider>

			<Toaster />

			<ReactQueryDevtools buttonPosition="bottom-right" />
		</QueryClientProvider>
	);
}
