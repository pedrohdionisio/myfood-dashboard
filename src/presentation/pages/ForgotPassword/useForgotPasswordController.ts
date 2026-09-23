import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type ForgotPasswordFormType,
	forgotPasswordSchema
} from 'data/modules/auth/useCases/forgotPassword/schemas/forgotPasswordSchema';
import { useForgotPassword } from 'data/modules/auth/useCases/forgotPassword/useForgotPassword';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';

export function useForgotPasswordController() {
	const navigate = useNavigate();
	const { forgotPassword } = useForgotPassword();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<ForgotPasswordFormType>({
		resolver: zodResolver(forgotPasswordSchema)
	});

	async function onSubmit({ email }: ForgotPasswordFormType) {
		try {
			const { message } = await forgotPassword({ email });

			toast.success(message);
			navigate(APP_ROUTES.resetPassword, { state: { email } });
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		register,
		errors,
		isSubmitting,
		handleSubmit: handleSubmit(onSubmit)
	};
}
