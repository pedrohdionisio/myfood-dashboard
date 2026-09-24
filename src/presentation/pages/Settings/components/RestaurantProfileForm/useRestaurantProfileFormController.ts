import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import { useAddressByZipCode } from 'data/modules/address/useCases/findAddressByZipCode/useAddressByZipCode';
import {
	type UpdateRestaurantFormType,
	type UpdateRestaurantPayloadType,
	updateRestaurantSchema
} from 'data/modules/restaurants/useCases/updateRestaurant/schemas/updateRestaurantSchema';
import { useUpdateRestaurant } from 'data/modules/restaurants/useCases/updateRestaurant/useUpdateRestaurant';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mask } from 'shared/utils/Mask';
import type { IRestaurantProfileFormProps } from './RestaurantProfileFormTypes';
import { toFormValues } from './utils/toFormValues';

export function useRestaurantProfileFormController({ restaurant }: IRestaurantProfileFormProps) {
	const { updateRestaurant, isUpdatingRestaurant } = useUpdateRestaurant();

	const {
		register,
		watch,
		reset,
		setFocus,
		setError,
		clearErrors,
		setValues,
		handleSubmit,
		formState: { errors, isDirty }
	} = useForm<UpdateRestaurantFormType, unknown, UpdateRestaurantPayloadType>({
		resolver: zodResolver(updateRestaurantSchema),
		defaultValues: toFormValues(restaurant)
	});

	const zipCode = watch('zipCode');
	const hasEditedZipCode = Mask.remove(zipCode) !== restaurant.zipCode;

	const { address, isZipCodeNotFound, isLoadingAddress, addressError } = useAddressByZipCode(
		hasEditedZipCode ? zipCode : ''
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

	async function onSubmit(payload: UpdateRestaurantPayloadType) {
		try {
			const updated = await updateRestaurant({ restaurantId: restaurant.id, ...payload });

			reset(toFormValues(updated));
			toast.success('Cadastro atualizado.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		register,
		errors,
		isLoadingAddress,
		isSubmitting: isUpdatingRestaurant,
		isDirty,
		handleSubmit: handleSubmit(onSubmit)
	};
}
