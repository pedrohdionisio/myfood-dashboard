import type { IAnalyticsRange } from 'data/modules/analytics/types/AnalyticsTypes';
import { addDays } from './addDays';
import { toBusinessDate } from './toBusinessDate';

export interface IAnalyticsRanges {
	current: IAnalyticsRange;
	previous: IAnalyticsRange;
}

export function resolveAnalyticsRanges(periodInDays: number): IAnalyticsRanges {
	const to = toBusinessDate(new Date());
	const from = addDays(to, 1 - periodInDays);

	return {
		current: { from, to },
		previous: { from: addDays(from, -periodInDays), to: addDays(from, -1) }
	};
}
