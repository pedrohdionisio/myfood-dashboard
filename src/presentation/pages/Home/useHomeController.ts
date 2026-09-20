import { useAuth } from 'data/contexts/AuthProvider';

export function useHomeController() {
	const { user, signOut } = useAuth();

	return {
		userName: user?.name ?? '',
		handleSignOut: signOut
	};
}
