import { api } from 'data/config/api';
import type { IAnalyticsRange } from 'data/modules/analytics/types/AnalyticsTypes';
import type { IAnalytics } from 'shared/entities/IAnalytics';

async function get(restaurantId: string, range: IAnalyticsRange): Promise<IAnalytics> {
	const { data } = await api.get<IAnalytics>(`/restaurants/${restaurantId}/analytics`, {
		params: range
	});

	return data;
}

export const AnalyticsService = {
	get
};
