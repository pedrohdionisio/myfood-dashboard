import { api } from 'data/config/api';
import type {
	IListOrdersParams,
	IOrdersPage,
	OrderTransition
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

export const OrdersService = {
	list,
	changeStatus,
	dispatch
};
