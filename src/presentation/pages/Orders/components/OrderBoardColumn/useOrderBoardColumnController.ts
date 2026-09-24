import { getApiErrorMessage } from 'data/config/apiError';
import { useInfiniteOrders } from 'data/modules/orders/useCases/listOrders/useInfiniteOrders';
import { useEffect, useRef } from 'react';
import type { IOrderBoardColumnProps } from './OrderBoardColumnTypes';

export function useOrderBoardColumnController({
	restaurantId,
	status,
	deliveredSince
}: Pick<IOrderBoardColumnProps, 'restaurantId' | 'status' | 'deliveredSince'>) {
	const {
		orders,
		hasMoreOrders,
		isLoadingOrders,
		isFetchingMoreOrders,
		ordersError,
		fetchMoreOrders
	} = useInfiniteOrders(restaurantId, { status, deliveredSince });

	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const loadMoreElement = loadMoreRef.current;

		if (!loadMoreElement || !hasMoreOrders || isFetchingMoreOrders) {
			return;
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				fetchMoreOrders();
			}
		});

		observer.observe(loadMoreElement);

		return () => observer.disconnect();
	}, [hasMoreOrders, isFetchingMoreOrders, fetchMoreOrders]);

	return {
		orders,
		hasMoreOrders,
		isLoadingOrders,
		isFetchingMoreOrders,
		ordersErrorMessage: ordersError ? getApiErrorMessage(ordersError) : null,
		isEmpty: !isLoadingOrders && !ordersError && orders.length === 0,
		loadMoreRef
	};
}
