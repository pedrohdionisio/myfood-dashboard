import { skipToken, useQueries } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IOrder, OrderStatus } from 'shared/entities/IOrder';

export interface IOrdersByStatus<TStatus extends OrderStatus> {
	status: TStatus;
	orders: IOrder[];
	hasMoreOrders: boolean;
	isLoadingOrders: boolean;
	ordersError: unknown;
}

export function useOrdersByStatus<TStatus extends OrderStatus>(
	restaurantId: string | null,
	statuses: readonly TStatus[]
): IOrdersByStatus<TStatus>[] {
	const results = useQueries({
		queries: statuses.map((status) => ({
			queryKey: [OrderQueryKeys.ORDERS, restaurantId, status],
			queryFn: restaurantId ? () => OrdersService.list(restaurantId, { status }) : skipToken,
			refetchInterval: 30_000
		}))
	});

	return statuses.map((status, index) => {
		const result = results[index];

		return {
			status,
			orders: result?.data?.items ?? [],
			hasMoreOrders: result?.data?.hasMore ?? false,
			isLoadingOrders: result?.isLoading ?? false,
			ordersError: result?.error ?? null
		};
	});
}
