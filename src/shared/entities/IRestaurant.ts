const RESTAURANT_STATUSES = ['DRAFT', 'ACTIVE', 'SUSPENDED'] as const;

export interface IImageUrls {
	sm: string;
	md: string;
	lg: string;
}

export type RestaurantStatus = (typeof RESTAURANT_STATUSES)[number];

export interface IRestaurant {
	id: string;
	slug: string;
	legalName: string;
	tradeName: string;
	cnpj: string;
	phone: string | null;
	email: string | null;
	description: string | null;
	logoKey: string | null;
	bannerKey: string | null;
	logoUrls: IImageUrls | null;
	bannerUrls: IImageUrls | null;
	zipCode: string;
	street: string;
	number: string;
	complement: string | null;
	neighborhood: string;
	city: string;
	state: string;
	deliveryFeeCents: number;
	minOrderCents: number;
	avgPrepTimeMin: number;
	status: RestaurantStatus;
	isAcceptingOrders: boolean;
	ratingAvg: number;
	ratingCount: number;
}
