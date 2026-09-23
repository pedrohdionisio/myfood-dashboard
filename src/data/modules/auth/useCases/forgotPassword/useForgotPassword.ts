import { useMutation } from '@tanstack/react-query';
import { AuthService } from 'data/modules/auth/services/AuthService';
import { AuthMutationKeys } from '../../keys/AuthKeys';

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
