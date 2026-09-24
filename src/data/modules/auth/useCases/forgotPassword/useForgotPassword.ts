import { useMutation } from '@tanstack/react-query';
import { AuthMutationKeys } from 'data/modules/auth/keys/AuthKeys';
import { AuthService } from 'data/modules/auth/services/AuthService';

export function useForgotPassword() {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: [AuthMutationKeys.FORGOT_PASSWORD],
		mutationFn: AuthService.forgotPassword
	});

	return {
		forgotPassword: mutateAsync,
		isSendingRecoveryCode: isPending
	};
}
