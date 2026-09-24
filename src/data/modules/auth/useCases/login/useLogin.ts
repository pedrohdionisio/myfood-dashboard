import { useMutation } from '@tanstack/react-query';
import { AuthMutationKeys } from 'data/modules/auth/keys/AuthKeys';
import { AuthService } from 'data/modules/auth/services/AuthService';

export function useLogin() {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: [AuthMutationKeys.LOGIN],
		mutationFn: AuthService.login
	});

	return {
		login: mutateAsync,
		isLoggingIn: isPending
	};
}
