import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import { useAuth } from 'data/contexts/AuthProvider';
import {
	type SignUpFormType,
	type SignUpPayloadType,
	signUpSchema
} from 'data/modules/auth/useCases/signUp/schemas/signUpSchema';
import { useSignUp } from 'data/modules/auth/useCases/signUp/useSignUp';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const SIGN_UP_DEFAULT_VALUES: SignUpFormType = {
	name: '',
	email: '',
	phone: '',
	password: ''
};

export function useSignUpFormController() {
	const { signUp } = useSignUp();
	const { signIn } = useAuth();

	const {
		register,
		handleSubmit: submitForm,
		formState: { errors, isSubmitting }
	} = useForm<SignUpFormType, unknown, SignUpPayloadType>({
		resolver: zodResolver(signUpSchema),
		defaultValues: SIGN_UP_DEFAULT_VALUES
	});

	const handleSubmit = submitForm(async (payload) => {
		try {
			signIn(await signUp(payload));
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
