import type { IOrder, OrderStatus } from 'shared/entities/IOrder';

export type OrderTransition =
	| 'confirm'
	| 'reject'
	| 'preparing'
	| 'ready'
	| 'cancel'
	| 'delivery-failed';

export interface IListOrdersParams {
	status?: OrderStatus;
	page?: number;
	perPage?: number;
}

export interface IOrdersPage {
	items: IOrder[];
	page: number;
	perPage: number;
	hasMore: boolean;
}

export interface IChangeOrderStatusVariables {
	restaurantId: string;
	orderId: string;
	transition: OrderTransition;
	reason?: string;
}

export interface IDispatchOrderVariables {
	restaurantId: string;
	orderId: string;
	driverMemberId: string;
}

export const ORDER_STREAM_EVENT_TYPES = ['ORDER_PLACED', 'ORDER_STATUS_CHANGED'] as const;

export type OrderStreamEventType = (typeof ORDER_STREAM_EVENT_TYPES)[number];

export interface IOrderStreamEvent {
	type: OrderStreamEventType;
	orderId: string;
	displayNumber: number;
	status: OrderStatus;
	occurredAt: string;
}
