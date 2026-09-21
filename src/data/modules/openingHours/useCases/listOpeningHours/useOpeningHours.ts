import { skipToken, useQuery } from '@tanstack/react-query';
import { OpeningHoursService } from 'data/modules/openingHours/services/OpeningHoursService';
import { OpeningHoursQueryKeys } from '../../keys/OpeningHoursKeys';

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
