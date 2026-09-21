import { skipToken, useQuery } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IListOrdersParams } from 'data/modules/orders/types/OrderTypes';

export function useOrders(restaurantId: string | null, params: IListOrdersParams) {
	const { data, isLoading, isFetching, error } = useQuery({
		queryKey: [OrderQueryKeys.ORDERS, restaurantId, params.status, params.page, params.perPage],
		queryFn: restaurantId ? () => OrdersService.list(restaurantId, params) : skipToken,
		placeholderData: (previousData) => previousData
	});

	return {
		orders: data?.items ?? [],
		hasMoreOrders: data?.hasMore ?? false,
		isLoadingOrders: isLoading,
		isFetchingOrders: isFetching,
		ordersError: error
	};
}
