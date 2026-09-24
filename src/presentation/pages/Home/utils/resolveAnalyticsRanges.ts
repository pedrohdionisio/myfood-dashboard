import type { IAnalyticsRange } from 'data/modules/analytics/types/AnalyticsTypes';
import { addDays } from './addDays';

export interface IAnalyticsRanges {
	current: IAnalyticsRange;
	previous: IAnalyticsRange;
}

export function resolveAnalyticsRanges(periodInDays: number, today: string): IAnalyticsRanges {
	const from = addDays(today, 1 - periodInDays);

	return {
		current: { from, to: today },
		previous: { from: addDays(from, -periodInDays), to: addDays(from, -1) }
	};
}
