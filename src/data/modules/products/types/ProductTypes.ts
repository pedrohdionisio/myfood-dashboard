export interface IProductPayload {
	menuCategoryId: string;
	name: string;
	description: string;
	priceCents: number;
}

export interface ICreateProductVariables extends IProductPayload {
	restaurantId: string;
}

export interface IUpdateProductVariables extends IProductPayload {
	restaurantId: string;
	productId: string;
}

export interface ISetProductAvailabilityVariables {
	restaurantId: string;
	productId: string;
	isAvailable: boolean;
}

export interface IArchiveProductVariables {
	restaurantId: string;
	productId: string;
}

export interface IReorderProductsPayload {
	menuCategoryId: string;
	ids: string[];
}

export interface IReorderProductsVariables extends IReorderProductsPayload {
	restaurantId: string;
}
