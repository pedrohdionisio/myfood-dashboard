import type { IOrder, OrderStatus } from 'shared/entities/IOrder';

export interface IListOrdersParams {
	status: OrderStatus;
	page?: number;
	perPage?: number;
}

export interface IOrdersPage {
	items: IOrder[];
	page: number;
	perPage: number;
	hasMore: boolean;
}
