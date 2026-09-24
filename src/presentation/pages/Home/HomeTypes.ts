import type { IAnalyticsRange } from 'data/modules/analytics/types/AnalyticsTypes';
import type { LucideIcon } from 'lucide-react';

export interface IStatCard {
	id: string;
	label: string;
	value: string;
	icon: LucideIcon;
	delta: number | null;
	isGrowthDesirable: boolean;
}

export interface IDailyPoint {
	date: string;
	label: string;
	ordersCount: number;
	deliveredCount: number;
	canceledCount: number;
	grossRevenueCents: number;
	deliveryFeeRevenueCents: number;
	avgPrepSeconds: number;
}

export interface IAnalyticsRanges {
	current: IAnalyticsRange;
	previous: IAnalyticsRange;
}
