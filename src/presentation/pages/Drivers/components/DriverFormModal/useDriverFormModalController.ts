import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type DriverFormType,
	type DriverPayloadType,
	driverSchema
} from 'data/modules/members/schemas/driverSchema';
import { useCreateMember } from 'data/modules/members/useCases/createMember/useCreateMember';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { IDriverFormModalProps } from './DriverFormModalTypes';

const EMPTY_DRIVER_FORM: DriverFormType = {
	name: '',
	email: '',
	phone: '',
	password: ''
};

export function useDriverFormModalController({
	isOpen,
	restaurantId,
	onClose
}: IDriverFormModalProps) {
	const { createMember, isCreatingMember } = useCreateMember();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<DriverFormType, unknown, DriverPayloadType>({
		resolver: zodResolver(driverSchema),
		defaultValues: EMPTY_DRIVER_FORM
	});

	useEffect(() => {
		if (isOpen) {
			reset(EMPTY_DRIVER_FORM);
		}
	}, [isOpen, reset]);

	async function onSubmit(payload: DriverPayloadType) {
		try {
			await createMember({ restaurantId, ...payload });
			toast.success('Entregador adicionado.');
			onClose();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		register,
		errors,
		isSubmitting: isCreatingMember,
		handleSubmit: handleSubmit(onSubmit)
	};
}
