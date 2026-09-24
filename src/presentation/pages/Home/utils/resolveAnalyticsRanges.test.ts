import { describe, expect, it } from 'vitest';
import { resolveAnalyticsRanges } from './resolveAnalyticsRanges';

describe('resolveAnalyticsRanges', () => {
	it('ends today and compares with the same number of days right before', () => {
		expect(resolveAnalyticsRanges(7, '2026-03-02')).toEqual({
			current: { from: '2026-02-24', to: '2026-03-02' },
			previous: { from: '2026-02-17', to: '2026-02-23' }
		});
	});
});
