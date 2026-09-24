import type { IAnalyticsRanges } from 'presentation/pages/Home/HomeTypes';
import { addDays } from './addDays';

export function resolveAnalyticsRanges(periodInDays: number, today: string): IAnalyticsRanges {
	const from = addDays(today, 1 - periodInDays);

	return {
		current: { from, to: today },
		previous: { from: addDays(from, -periodInDays), to: addDays(from, -1) }
	};
}
