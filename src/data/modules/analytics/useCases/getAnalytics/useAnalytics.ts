import { skipToken, useQuery } from '@tanstack/react-query';
import { AnalyticsQueryKeys } from 'data/modules/analytics/keys/AnalyticsKeys';
import { AnalyticsService } from 'data/modules/analytics/services/AnalyticsService';
import type { IAnalyticsRange } from 'data/modules/analytics/types/AnalyticsTypes';

export function useAnalytics(restaurantId: string | null, range: IAnalyticsRange) {
	const { data, isLoading, error } = useQuery({
		queryKey: [AnalyticsQueryKeys.ANALYTICS, restaurantId, range.from, range.to],
		queryFn: restaurantId ? () => AnalyticsService.get(restaurantId, range) : skipToken
	});

	return {
		analytics: data ?? null,
		isLoadingAnalytics: isLoading,
		analyticsError: error
	};
}
