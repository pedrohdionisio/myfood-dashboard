import { skipToken, useInfiniteQuery } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IOrdersPage } from 'data/modules/orders/types/OrderTypes';
import type { IOrder, OrderStatus } from 'shared/entities/IOrder';

export interface IUseInfiniteOrdersParams {
	status: OrderStatus;
	createdSince?: string;
}

export function useInfiniteOrders(
	restaurantId: string | null,
	{ status, createdSince }: IUseInfiniteOrdersParams
) {
	function isInRange(order: IOrder) {
		return !createdSince || Date.parse(order.createdAt) >= Date.parse(createdSince);
	}

	function getNextPageParam(lastPage: IOrdersPage) {
		const lastOrder = lastPage.items.at(-1);

		if (!lastPage.hasMore || (lastOrder && !isInRange(lastOrder))) {
			return undefined;
		}

		return lastPage.page + 1;
	}

	const { data, isLoading, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: [OrderQueryKeys.ORDERS, restaurantId, 'infinite', status, createdSince],
			queryFn: restaurantId
				? ({ pageParam }) => OrdersService.list(restaurantId, { status, page: pageParam })
				: skipToken,
			initialPageParam: 1,
			getNextPageParam,
			refetchInterval: 60_000
		});

	const orders = data?.pages.flatMap((page) => page.items).filter(isInRange) ?? [];

	return {
		orders: [...new Map(orders.map((order) => [order.id, order])).values()],
		hasMoreOrders: hasNextPage,
		isLoadingOrders: isLoading,
		isFetchingMoreOrders: isFetchingNextPage,
		ordersError: error,
		fetchMoreOrders: fetchNextPage
	};
}
