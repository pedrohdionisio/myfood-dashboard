import { skipToken, useQuery } from '@tanstack/react-query';
import { OpeningHoursQueryKeys } from 'data/modules/openingHours/keys/OpeningHoursKeys';
import { OpeningHoursService } from 'data/modules/openingHours/services/OpeningHoursService';

export function useOpeningHours(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [OpeningHoursQueryKeys.OPENING_HOURS, restaurantId],
		queryFn: restaurantId ? () => OpeningHoursService.list(restaurantId) : skipToken
	});

	return {
		openingHours: data ?? [],
		isLoadingOpeningHours: isLoading,
		openingHoursError: error
	};
}
