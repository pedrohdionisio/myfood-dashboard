import type { IAnalytics } from 'shared/entities/IAnalytics';

export function buildAnalytics(overrides: Partial<IAnalytics> = {}): IAnalytics {
	return {
		from: '2026-08-26',
		to: '2026-09-24',
		totals: {
			ordersCount: 0,
			deliveredCount: 0,
			canceledCount: 0,
			grossRevenueCents: 0,
			deliveryFeeRevenueCents: 0,
			avgTicketCents: 0,
			avgPrepSeconds: 0
		},
		daily: [],
		topProducts: [],
		...overrides
	};
}
