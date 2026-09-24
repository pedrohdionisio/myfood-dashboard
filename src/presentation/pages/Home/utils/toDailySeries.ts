import type { IAnalyticsRange } from 'data/modules/analytics/types/AnalyticsTypes';
import type { IDailyPoint } from 'presentation/pages/Home/HomeTypes';
import type { IDailyStat } from 'shared/entities/IAnalytics';
import { addDays } from './addDays';
import { formatDayLabel } from './formatDayLabel';

export function toDailySeries(daily: IDailyStat[], range: IAnalyticsRange): IDailyPoint[] {
	const statsByDate = new Map(daily.map((stat) => [stat.date, stat]));
	const series: IDailyPoint[] = [];

	for (let date = range.from; date <= range.to; date = addDays(date, 1)) {
		const stat = statsByDate.get(date);

		series.push({
			date,
			label: formatDayLabel(date),
			ordersCount: stat?.ordersCount ?? 0,
			deliveredCount: stat?.deliveredCount ?? 0,
			canceledCount: stat?.canceledCount ?? 0,
			grossRevenueCents: stat?.grossRevenueCents ?? 0,
			deliveryFeeRevenueCents: stat?.deliveryFeeRevenueCents ?? 0,
			avgPrepSeconds: stat?.deliveredCount
				? Math.round(stat.totalPrepSeconds / stat.deliveredCount)
				: 0
		});
	}

	return series;
}
