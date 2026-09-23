import { useMutation } from '@tanstack/react-query';
import { AuthService } from 'data/modules/auth/services/AuthService';
import { AuthMutationKeys } from '../../keys/AuthKeys';

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
