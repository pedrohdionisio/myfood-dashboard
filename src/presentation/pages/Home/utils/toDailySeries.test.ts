import type { IDailyStat } from 'shared/entities/IAnalytics';
import { describe, expect, it } from 'vitest';
import { toDailySeries } from './toDailySeries';

describe('toDailySeries', () => {
	it('fills days without stats with zeros and averages the preparation time', () => {
		const stat: IDailyStat = {
			date: '2026-03-02',
			ordersCount: 4,
			deliveredCount: 2,
			canceledCount: 1,
			grossRevenueCents: 10000,
			deliveryFeeRevenueCents: 1400,
			totalPrepSeconds: 3000
		};

		const series = toDailySeries([stat], { from: '2026-03-01', to: '2026-03-02' });

		expect(series.map((point) => [point.label, point.ordersCount, point.avgPrepSeconds])).toEqual([
			['01/03', 0, 0],
			['02/03', 4, 1500]
		]);
	});
});
