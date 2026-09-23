import { api, getAuthorizationHeader, renewAccessToken } from 'data/config/api';
import { env } from 'data/config/env';
import { openEventStream } from 'data/libs/openEventStream';
import {
	type IListOrdersParams,
	type IOrderStreamEvent,
	type IOrdersPage,
	ORDER_STREAM_EVENT_TYPES,
	type OrderTransition
} from 'data/modules/orders/types/OrderTypes';
import type { IOrder } from 'shared/entities/IOrder';

async function list(restaurantId: string, params: IListOrdersParams): Promise<IOrdersPage> {
	const { data } = await api.get<IOrdersPage>(`/restaurants/${restaurantId}/orders`, { params });

	return data;
}

async function changeStatus(
	restaurantId: string,
	orderId: string,
	transition: OrderTransition,
	reason?: string
): Promise<IOrder> {
	const { data } = await api.post<IOrder>(
		`/restaurants/${restaurantId}/orders/${orderId}/${transition}`,
		{ reason: reason || undefined }
	);

	return data;
}

async function dispatch(
	restaurantId: string,
	orderId: string,
	driverMemberId: string
): Promise<IOrder> {
	const { data } = await api.post<IOrder>(
		`/restaurants/${restaurantId}/orders/${orderId}/dispatch`,
		{ driverMemberId }
	);

	return data;
}

function isOrderStreamEvent(value: unknown): value is IOrderStreamEvent {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const { type, orderId, displayNumber, status } = value as Partial<IOrderStreamEvent>;

	return (
		ORDER_STREAM_EVENT_TYPES.some((eventType) => eventType === type) &&
		typeof orderId === 'string' &&
		typeof displayNumber === 'number' &&
		typeof status === 'string'
	);
}

function toOrderStreamEvent(data: string): IOrderStreamEvent | null {
	try {
		const parsed: unknown = JSON.parse(data);

		return isOrderStreamEvent(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function subscribe(restaurantId: string, onEvent: (event: IOrderStreamEvent) => void): () => void {
	return openEventStream({
		url: `${env.apiUrl}/restaurants/${restaurantId}/orders/stream`,
		resolveAuthorization: getAuthorizationHeader,
		renewAuthorization: renewAccessToken,
		onMessage: ({ data }) => {
			const orderEvent = toOrderStreamEvent(data);

			if (orderEvent) {
				onEvent(orderEvent);
			}
		}
	});
}

export const OrdersService = {
	list,
	changeStatus,
	dispatch,
	subscribe
};
