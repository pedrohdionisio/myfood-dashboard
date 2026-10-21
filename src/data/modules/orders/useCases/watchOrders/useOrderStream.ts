import { useQueryClient } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type {
	IOrderStreamEvent,
	IUseOrderStreamParams
} from 'data/modules/orders/types/OrderTypes';
import { useEffect, useEffectEvent } from 'react';

export function useOrderStream({ restaurantId, onOrderPlaced }: IUseOrderStreamParams) {
	const queryClient = useQueryClient();

	const handleEvent = useEffectEvent((event: IOrderStreamEvent) => {
		queryClient.invalidateQueries({ queryKey: [OrderQueryKeys.ORDERS, restaurantId] });

		if (event.type === 'ORDER_PLACED') {
			onOrderPlaced(event);
		}
	});

	const handleReconnect = useEffectEvent(() => {
		queryClient.invalidateQueries({ queryKey: [OrderQueryKeys.ORDERS, restaurantId] });
	});

	useEffect(() => {
		if (!restaurantId) {
			return;
		}

		return OrdersService.subscribe(restaurantId, handleEvent, handleReconnect);
	}, [restaurantId]);
}
