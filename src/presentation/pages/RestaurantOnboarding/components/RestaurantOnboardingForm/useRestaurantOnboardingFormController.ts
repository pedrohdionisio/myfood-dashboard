import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import { useAddressByZipCode } from 'data/modules/address/useCases/findAddressByZipCode/useAddressByZipCode';
import {
	type CreateRestaurantFormType,
	type CreateRestaurantPayloadType,
	createRestaurantSchema
} from 'data/modules/restaurants/useCases/createRestaurant/schemas/createRestaurantSchema';
import { useCreateRestaurant } from 'data/modules/restaurants/useCases/createRestaurant/useCreateRestaurant';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CREATE_RESTAURANT_DEFAULT_VALUES: CreateRestaurantFormType = {
	tradeName: '',
	legalName: '',
	cnpj: '',
	phone: '',
	email: '',
	zipCode: '',
	street: '',
	number: '',
	complement: '',
	neighborhood: '',
	city: '',
	state: ''
};

export function useRestaurantOnboardingFormController() {
	const { createRestaurant } = useCreateRestaurant();

	const {
		register,
		watch,
		setFocus,
		setError,
		clearErrors,
		setValues,
		handleSubmit: submitForm,
		formState: { errors, isSubmitting }
	} = useForm<CreateRestaurantFormType, unknown, CreateRestaurantPayloadType>({
		resolver: zodResolver(createRestaurantSchema),
		defaultValues: CREATE_RESTAURANT_DEFAULT_VALUES
	});

	const { address, isZipCodeNotFound, isLoadingAddress, addressError } = useAddressByZipCode(
		watch('zipCode')
	);

	useEffect(() => {
		if (isLoadingAddress) {
			clearErrors('zipCode');

			return;
		}

		if (isZipCodeNotFound) {
			setError('zipCode', { message: 'CEP não encontrado' });

			return;
		}

		if (addressError) {
			setError('zipCode', { message: 'Não foi possível consultar o CEP. Preencha o endereço.' });

			return;
		}

		if (!address) {
			return;
		}

		setValues({
			street: address.street,
			neighborhood: address.neighborhood,
			city: address.city,
			state: address.state
		});

		setFocus('number');
	}, [
		address,
		isZipCodeNotFound,
		isLoadingAddress,
		addressError,
		setValues,
		setFocus,
		setError,
		clearErrors
	]);

	const handleSubmit = submitForm(async (payload) => {
		try {
			const restaurant = await createRestaurant(payload);

			toast.success(`${restaurant.tradeName} cadastrado. Monte o cardápio para abrir a loja.`);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	});

	return {
		register,
		errors,
		isLoadingAddress,
		isSubmitting,
		handleSubmit
	};
}
