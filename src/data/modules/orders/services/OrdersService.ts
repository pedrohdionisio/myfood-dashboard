import { api } from 'data/config/api';
import type { IListOrdersParams, IOrdersPage } from 'data/modules/orders/types/OrderTypes';

async function list(restaurantId: string, params: IListOrdersParams): Promise<IOrdersPage> {
	const { data } = await api.get<IOrdersPage>(`/restaurants/${restaurantId}/orders`, { params });

	return data;
}

export const OrdersService = {
	list
};
