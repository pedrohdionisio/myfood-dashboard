import { useMutation } from '@tanstack/react-query';
import { AuthMutationKeys } from 'data/modules/auth/keys/AuthKeys';
import { AuthService } from 'data/modules/auth/services/AuthService';

export function useSignUp() {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: [AuthMutationKeys.SIGN_UP],
		mutationFn: AuthService.signUp
	});

	return {
		signUp: mutateAsync,
		isSigningUp: isPending
	};
}
