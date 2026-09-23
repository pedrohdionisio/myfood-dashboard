import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import { useForgotPassword } from 'data/modules/auth/useCases/forgotPassword/useForgotPassword';
import {
	type ResetPasswordFormType,
	type ResetPasswordPayloadType,
	resetPasswordSchema
} from 'data/modules/auth/useCases/resetPassword/schemas/resetPasswordSchema';
import { useResetPassword } from 'data/modules/auth/useCases/resetPassword/useResetPassword';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { readRecoveryEmail } from './utils/readRecoveryEmail';

export function useResetPasswordController() {
	const navigate = useNavigate();
	const location = useLocation();
	const email = readRecoveryEmail(location.state);

	const { resetPassword } = useResetPassword();
	const { forgotPassword, isSendingRecoveryCode } = useForgotPassword();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<ResetPasswordFormType, unknown, ResetPasswordPayloadType>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { code: '', password: '', passwordConfirmation: '' }
	});

	async function onSubmit(payload: ResetPasswordPayloadType) {
		if (!email) {
			return;
		}

		try {
			const { message } = await resetPassword({ email, ...payload });

			toast.success(message);
			navigate(APP_ROUTES.login, { replace: true });
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	async function handleResendCode() {
		if (!email) {
			return;
		}

		try {
			const { message } = await forgotPassword({ email });

			toast.success(message);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		email,
		register,
		errors,
		isSubmitting,
		isSendingRecoveryCode,
		handleResendCode,
		handleSubmit: handleSubmit(onSubmit)
	};
}
