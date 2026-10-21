import { isAxiosError } from 'axios';
import { api } from 'data/config/api';
import { type IRealtimeTicket, openRealtimeSocket } from 'data/libs/openRealtimeSocket';
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

// 401 já passou pela renovação do interceptor; 403 e 404 não mudam tentando de novo.
function isPermanentFailure(status: number) {
	return status >= 400 && status < 500 && status !== 408 && status !== 429;
}

async function requestStreamTicket(restaurantId: string): Promise<IRealtimeTicket | null> {
	try {
		const { data } = await api.post<IRealtimeTicket>(
			`/restaurants/${restaurantId}/orders/stream-ticket`
		);

		return data;
	} catch (error) {
		if (isAxiosError(error) && error.response && isPermanentFailure(error.response.status)) {
			return null;
		}

		throw error;
	}
}

function subscribe(
	restaurantId: string,
	onEvent: (event: IOrderStreamEvent) => void,
	onReconnect: () => void
): () => void {
	return openRealtimeSocket({
		requestTicket: () => requestStreamTicket(restaurantId),
		onReconnect,
		onMessage: (data) => {
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
