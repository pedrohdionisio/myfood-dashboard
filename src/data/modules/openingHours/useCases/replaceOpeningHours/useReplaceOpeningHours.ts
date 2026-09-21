import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OpeningHoursService } from 'data/modules/openingHours/services/OpeningHoursService';
import type { IReplaceOpeningHoursVariables } from 'data/modules/openingHours/types/OpeningHoursTypes';
import { OpeningHoursMutationKeys, OpeningHoursQueryKeys } from '../../keys/OpeningHoursKeys';

export function useReplaceOpeningHours() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [OpeningHoursMutationKeys.REPLACE_OPENING_HOURS],
		mutationFn: ({ restaurantId, ...payload }: IReplaceOpeningHoursVariables) =>
			OpeningHoursService.replaceOpeningHours(restaurantId, payload),
		onSuccess(openingHours, { restaurantId }) {
			queryClient.setQueryData([OpeningHoursQueryKeys.OPENING_HOURS, restaurantId], openingHours);
		}
	});

	return {
		replaceOpeningHours: mutateAsync,
		isReplacingOpeningHours: isPending
	};
}
