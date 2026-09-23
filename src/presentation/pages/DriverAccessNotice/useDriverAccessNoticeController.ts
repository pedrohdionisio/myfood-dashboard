import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';

export function useDriverAccessNoticeController() {
	const { user, signOut } = useAuth();

	return {
		userName: user?.name ?? '',
		handleSignOut: signOut
	};
}
