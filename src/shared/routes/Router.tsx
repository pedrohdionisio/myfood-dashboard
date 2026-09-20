import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { SelectedRestaurantProvider } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { BrowserRouter } from 'react-router-dom';
import { SignedInRoutes } from './SignedInRoutes';
import { SignedOutRoutes } from './SignedOutRoutes';

export function Router() {
	const { signedIn } = useAuth();

	return (
		<BrowserRouter>
			{signedIn ? (
				<SelectedRestaurantProvider>
					<SignedInRoutes />
				</SelectedRestaurantProvider>
			) : (
				<SignedOutRoutes />
			)}
		</BrowserRouter>
	);
}
