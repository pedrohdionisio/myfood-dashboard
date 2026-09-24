import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	OpeningHoursMutationKeys,
	OpeningHoursQueryKeys
} from 'data/modules/openingHours/keys/OpeningHoursKeys';
import { OpeningHoursService } from 'data/modules/openingHours/services/OpeningHoursService';
import type { IReplaceOpeningHoursVariables } from 'data/modules/openingHours/types/OpeningHoursTypes';
import { RestaurantQueryKeys } from 'data/modules/restaurants/keys/RestaurantKeys';

export function useReplaceOpeningHours() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [OpeningHoursMutationKeys.REPLACE_OPENING_HOURS],
		mutationFn: ({ restaurantId, ...payload }: IReplaceOpeningHoursVariables) =>
			OpeningHoursService.replace(restaurantId, payload),
		async onSuccess(openingHours, { restaurantId }) {
			queryClient.setQueryData([OpeningHoursQueryKeys.OPENING_HOURS, restaurantId], openingHours);

			await queryClient.invalidateQueries({
				queryKey: [RestaurantQueryKeys.ACTIVATION_CHECKLIST, restaurantId]
			});
		}
	});

	return {
		replaceOpeningHours: mutateAsync,
		isReplacingOpeningHours: isPending
	};
}
