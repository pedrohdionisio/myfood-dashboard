import {
	BanIcon,
	BanknoteIcon,
	BikeIcon,
	ClipboardCheckIcon,
	ClipboardListIcon,
	type LucideIcon,
	ReceiptIcon,
	TimerIcon
} from 'lucide-react';
import type { IAnalyticsTotals } from 'shared/entities/IAnalytics';
import { Mask } from 'shared/utils/Mask';
import { formatPrepTime } from './formatPrepTime';
import { toStatDelta } from './toStatDelta';

export interface IStatCard {
	id: string;
	label: string;
	value: string;
	icon: LucideIcon;
	delta: number | null;
	isGrowthDesirable: boolean;
}

export function toStatCards(
	totals: IAnalyticsTotals,
	previousTotals: IAnalyticsTotals | null
): IStatCard[] {
	const hasDeliveries = totals.deliveredCount > 0;

	return [
		{
			id: 'grossRevenue',
			label: 'Receita bruta',
			value: `R$ ${Mask.currency(String(totals.grossRevenueCents))}`,
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
			value: hasDeliveries ? `R$ ${Mask.currency(String(totals.avgTicketCents))}` : '—',
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
			value: `R$ ${Mask.currency(String(totals.deliveryFeeRevenueCents))}`,
			icon: BikeIcon,
			delta: previousTotals
				? toStatDelta(totals.deliveryFeeRevenueCents, previousTotals.deliveryFeeRevenueCents)
				: null,
			isGrowthDesirable: true
		}
	];
}
