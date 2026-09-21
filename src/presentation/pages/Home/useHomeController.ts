import { getApiErrorMessage } from 'data/config/apiError';
import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { useAnalytics } from 'data/modules/analytics/useCases/getAnalytics/useAnalytics';
import { useMemo, useState } from 'react';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';
import { resolveAnalyticsRanges } from './utils/resolveAnalyticsRanges';
import { toDailySeries } from './utils/toDailySeries';
import { toStatCards } from './utils/toStatCards';

const PERIOD_OPTIONS = [
	{ value: '7', label: 'Últimos 7 dias' },
	{ value: '30', label: 'Últimos 30 dias' },
	{ value: '90', label: 'Últimos 90 dias' }
];

export function useHomeController() {
	const { user } = useAuth();
	const { restaurantId, isOwner, restaurantGate } = useRestaurantGate();

	const [periodInDays, setPeriodInDays] = useState(30);

	const canSeeAnalytics = isOwner && restaurantGate === 'OPERATING';

	const ranges = useMemo(() => resolveAnalyticsRanges(periodInDays), [periodInDays]);

	const { analytics, isLoadingAnalytics, analyticsError } = useAnalytics(
		canSeeAnalytics ? restaurantId : null,
		ranges.current
	);
	const { analytics: previousAnalytics } = useAnalytics(
		canSeeAnalytics ? restaurantId : null,
		ranges.previous
	);

	function handleSelectPeriod(value: string) {
		setPeriodInDays(Number(value));
	}

	return {
		userName: user?.name ?? '',
		restaurantId,
		restaurantGate,
		canSeeAnalytics,
		isAnalyticsBlockedByRole: !isOwner && restaurantGate === 'OPERATING',
		periodOptions: PERIOD_OPTIONS,
		selectedPeriod: String(periodInDays),
		statCards: analytics ? toStatCards(analytics.totals, previousAnalytics?.totals ?? null) : [],
		dailySeries: analytics ? toDailySeries(analytics.daily, ranges.current) : [],
		topProducts: analytics?.topProducts ?? [],
		isLoadingAnalytics,
		analyticsErrorMessage: analyticsError ? getApiErrorMessage(analyticsError) : null,
		handleSelectPeriod
	};
}
