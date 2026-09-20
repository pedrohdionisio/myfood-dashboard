import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import {
	type LoginFormType,
	loginSchema
} from 'data/modules/auth/useCases/login/schemas/loginSchema';
import { useLogin } from 'data/modules/auth/useCases/login/useLogin';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function useLoginFormController() {
	const { login } = useLogin();
	const { signIn } = useAuth();

	const {
		register,
		handleSubmit: submitForm,
		formState: { errors, isSubmitting }
	} = useForm<LoginFormType>({
		resolver: zodResolver(loginSchema)
	});

	const handleSubmit = submitForm(async (formData) => {
		try {
			signIn(await login(formData));
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	});

	return {
		register,
		errors,
		isSubmitting,
		handleSubmit
	};
}
