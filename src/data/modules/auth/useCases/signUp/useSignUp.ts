import { useMutation } from '@tanstack/react-query';
import { AuthService } from 'data/modules/auth/services/AuthService';
import { AuthMutationKeys } from '../../keys/AuthKeys';

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
