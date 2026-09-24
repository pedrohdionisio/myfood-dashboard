import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import type { IOrdersPage } from 'data/modules/orders/types/OrderTypes';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { IOrder } from 'shared/entities/IOrder';

export function useBoardOrder(restaurantId: string | null, orderId: string | null) {
	const queryClient = useQueryClient();
	const lastSeenOrderRef = useRef<IOrder | null>(null);

	const subscribe = useCallback(
		(onStoreChange: () => void) => queryClient.getQueryCache().subscribe(onStoreChange),
		[queryClient]
	);

	const getSnapshot = useCallback(() => {
		if (!restaurantId || !orderId) {
			return null;
		}

		const boardQueries = queryClient
			.getQueryCache()
			.findAll({ queryKey: [OrderQueryKeys.ORDERS, restaurantId, 'infinite'] })
			.sort((first, second) => second.state.dataUpdatedAt - first.state.dataUpdatedAt);

		for (const { queryKey } of boardQueries) {
			const order = queryClient
				.getQueryData<InfiniteData<IOrdersPage>>(queryKey)
				?.pages.flatMap((page) => page.items)
				.find((item) => item.id === orderId);

			if (order) {
				lastSeenOrderRef.current = order;

				return order;
			}
		}

		return lastSeenOrderRef.current?.id === orderId ? lastSeenOrderRef.current : null;
	}, [queryClient, restaurantId, orderId]);

	return {
		boardOrder: useSyncExternalStore(subscribe, getSnapshot)
	};
}
