import {
	BanIcon,
	BanknoteIcon,
	BikeIcon,
	ClipboardCheckIcon,
	ClipboardListIcon,
	ReceiptIcon,
	TimerIcon
} from 'lucide-react';
import type { IStatCard } from 'presentation/pages/Home/HomeTypes';
import type { IAnalyticsTotals } from 'shared/entities/IAnalytics';
import { formatCurrency } from 'shared/utils/formatCurrency';
import { formatPrepTime } from './formatPrepTime';
import { toStatDelta } from './toStatDelta';

export function toStatCards(
	totals: IAnalyticsTotals,
	previousTotals: IAnalyticsTotals | null
): IStatCard[] {
	const hasDeliveries = totals.deliveredCount > 0;

	return [
		{
			id: 'grossRevenue',
			label: 'Receita bruta',
			value: formatCurrency(totals.grossRevenueCents),
			icon: BanknoteIcon,
			delta: previousTotals
				? toStatDelta(totals.grossRevenueCents, previousTotals.grossRevenueCents)
				: null,
			isGrowthDesirable: true
		},
		{
			id: 'ordersCount',
			label: 'Pedidos recebidos',
			value: String(totals.ordersCount),
			icon: ClipboardListIcon,
			delta: previousTotals ? toStatDelta(totals.ordersCount, previousTotals.ordersCount) : null,
			isGrowthDesirable: true
		},
		{
			id: 'deliveredCount',
			label: 'Entregues',
			value: String(totals.deliveredCount),
			icon: ClipboardCheckIcon,
			delta: previousTotals
				? toStatDelta(totals.deliveredCount, previousTotals.deliveredCount)
				: null,
			isGrowthDesirable: true
		},
		{
			id: 'canceledCount',
			label: 'Cancelados',
			value: String(totals.canceledCount),
			icon: BanIcon,
			delta: previousTotals
				? toStatDelta(totals.canceledCount, previousTotals.canceledCount)
				: null,
			isGrowthDesirable: false
		},
		{
			id: 'avgTicket',
			label: 'Ticket médio',
			value: hasDeliveries ? formatCurrency(totals.avgTicketCents) : '—',
			icon: ReceiptIcon,
			delta:
				hasDeliveries && previousTotals
					? toStatDelta(totals.avgTicketCents, previousTotals.avgTicketCents)
					: null,
			isGrowthDesirable: true
		},
		{
			id: 'avgPrepTime',
			label: 'Tempo de preparo',
			value: hasDeliveries ? formatPrepTime(totals.avgPrepSeconds) : '—',
			icon: TimerIcon,
			delta:
				hasDeliveries && previousTotals
					? toStatDelta(totals.avgPrepSeconds, previousTotals.avgPrepSeconds)
					: null,
			isGrowthDesirable: false
		},
		{
			id: 'deliveryFeeRevenue',
			label: 'Taxas de entrega',
			value: formatCurrency(totals.deliveryFeeRevenueCents),
			icon: BikeIcon,
			delta: previousTotals
				? toStatDelta(totals.deliveryFeeRevenueCents, previousTotals.deliveryFeeRevenueCents)
				: null,
			isGrowthDesirable: true
		}
	];
}
