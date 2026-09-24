import { skipToken, useInfiniteQuery } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IOrdersPage, IUseInfiniteOrdersParams } from 'data/modules/orders/types/OrderTypes';
import type { IOrder } from 'shared/entities/IOrder';

export function useInfiniteOrders(
	restaurantId: string | null,
	{ status, deliveredSince }: IUseInfiniteOrdersParams
) {
	function isInRange(order: IOrder) {
		return (
			!deliveredSince ||
			Date.parse(order.deliveredAt ?? order.createdAt) >= Date.parse(deliveredSince)
		);
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
			queryKey: [OrderQueryKeys.ORDERS, restaurantId, 'infinite', status, deliveredSince],
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
