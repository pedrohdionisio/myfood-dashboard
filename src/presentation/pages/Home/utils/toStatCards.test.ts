import type { IAnalyticsTotals } from 'shared/entities/IAnalytics';
import { describe, expect, it } from 'vitest';
import { toStatCards } from './toStatCards';

const totals: IAnalyticsTotals = {
	ordersCount: 10,
	deliveredCount: 0,
	canceledCount: 2,
	grossRevenueCents: 50000,
	deliveryFeeRevenueCents: 7000,
	avgTicketCents: 0,
	avgPrepSeconds: 0
};

describe('toStatCards', () => {
	it('should show a dash for averages when nothing was delivered', () => {
		const cards = toStatCards(totals, null);

		expect(cards.find((card) => card.id === 'avgTicket')?.value).toBe('—');
		expect(cards.find((card) => card.id === 'avgPrepTime')?.value).toBe('—');
		expect(cards.find((card) => card.id === 'grossRevenue')?.value).toBe('R$ 500,00');
	});

	it('should compare with the previous period when there is one', () => {
		const cards = toStatCards(totals, { ...totals, ordersCount: 5, canceledCount: 4 });

		expect(cards.find((card) => card.id === 'ordersCount')?.delta).toBe(100);
		expect(cards.find((card) => card.id === 'canceledCount')).toMatchObject({
			delta: -50,
			isGrowthDesirable: false
		});
	});
});
