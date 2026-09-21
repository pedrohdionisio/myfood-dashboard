export interface IAnalyticsTotals {
	ordersCount: number;
	deliveredCount: number;
	canceledCount: number;
	grossRevenueCents: number;
	deliveryFeeRevenueCents: number;
	avgTicketCents: number;
	avgPrepSeconds: number;
}

export interface IDailyStat {
	date: string;
	ordersCount: number;
	deliveredCount: number;
	canceledCount: number;
	grossRevenueCents: number;
	deliveryFeeRevenueCents: number;
	totalPrepSeconds: number;
}

export interface IProductSale {
	productId: string;
	productName: string;
	quantity: number;
	revenueCents: number;
}

export interface IAnalytics {
	from: string;
	to: string;
	totals: IAnalyticsTotals;
	daily: IDailyStat[];
	topProducts: IProductSale[];
}
