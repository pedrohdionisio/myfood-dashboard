import { useAuth } from 'data/contexts/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { SignedInRoutes } from './SignedInRoutes';
import { SignedOutRoutes } from './SignedOutRoutes';

export function Router() {
	const { signedIn } = useAuth();

	return <BrowserRouter>{signedIn ? <SignedInRoutes /> : <SignedOutRoutes />}</BrowserRouter>;
}
