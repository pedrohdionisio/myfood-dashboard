import { useMutation } from '@tanstack/react-query';
import { AuthService } from 'data/modules/auth/services/AuthService';
import { AuthMutationKeys } from '../../keys/AuthKeys';

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
