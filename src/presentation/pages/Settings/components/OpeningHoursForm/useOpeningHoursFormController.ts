import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type OpeningHoursFormType,
	type ReplaceOpeningHoursPayloadType,
	replaceOpeningHoursSchema
} from 'data/modules/openingHours/useCases/replaceOpeningHours/schemas/replaceOpeningHoursSchema';
import { useReplaceOpeningHours } from 'data/modules/openingHours/useCases/replaceOpeningHours/useReplaceOpeningHours';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { IUseOpeningHoursFormControllerParams } from './OpeningHoursFormTypes';
import { toFormValues } from './utils/toFormValues';

export function useOpeningHoursFormController({
	restaurantId,
	openingHours
}: IUseOpeningHoursFormControllerParams) {
	const { replaceOpeningHours } = useReplaceOpeningHours();

	const {
		control,
		register,
		reset,
		handleSubmit,
		formState: { isDirty, isSubmitting }
	} = useForm<OpeningHoursFormType, unknown, ReplaceOpeningHoursPayloadType>({
		resolver: zodResolver(replaceOpeningHoursSchema),
		defaultValues: toFormValues(openingHours)
	});

	async function onSubmit(payload: ReplaceOpeningHoursPayloadType) {
		try {
			const updatedOpeningHours = await replaceOpeningHours({ restaurantId, ...payload });

			reset(toFormValues(updatedOpeningHours));
			toast.success('Horários de funcionamento atualizados.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		control,
		register,
		isDirty,
		isSubmitting,
		handleSubmit: handleSubmit(onSubmit)
	};
}
