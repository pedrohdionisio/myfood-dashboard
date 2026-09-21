export interface ICreateRestaurantPayload {
	legalName: string;
	tradeName: string;
	cnpj: string;
	phone?: string;
	email?: string;
	zipCode: string;
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
}

export interface IUpdateRestaurantPayload {
	legalName?: string;
	tradeName?: string;
	phone?: string;
	email?: string;
	description?: string;
	zipCode?: string;
	street?: string;
	number?: string;
	complement?: string;
	neighborhood?: string;
	city?: string;
	state?: string;
	deliveryFeeCents?: number;
	minOrderCents?: number;
	avgPrepTimeMin?: number;
	logoKey?: string | null;
	bannerKey?: string | null;
}

export interface IUpdateRestaurantVariables extends IUpdateRestaurantPayload {
	restaurantId: string;
}

export interface ISetAcceptingOrdersVariables {
	restaurantId: string;
	isAcceptingOrders: boolean;
}
