import { useMutation } from '@tanstack/react-query';
import { AuthMutationKeys } from 'data/modules/auth/keys/AuthKeys';
import { AuthService } from 'data/modules/auth/services/AuthService';

export function useResetPassword() {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: [AuthMutationKeys.RESET_PASSWORD],
		mutationFn: AuthService.resetPassword
	});

	return {
		resetPassword: mutateAsync,
		isResettingPassword: isPending
	};
}
