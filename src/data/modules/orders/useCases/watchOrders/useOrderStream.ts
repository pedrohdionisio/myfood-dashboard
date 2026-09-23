import { useQueryClient } from '@tanstack/react-query';
import { OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IOrderStreamEvent } from 'data/modules/orders/types/OrderTypes';
import { useEffect, useEffectEvent } from 'react';

export interface IUseOrderStreamParams {
	restaurantId: string | null;
	onOrderPlaced: (event: IOrderStreamEvent) => void;
}

export function useOrderStream({ restaurantId, onOrderPlaced }: IUseOrderStreamParams) {
	const queryClient = useQueryClient();

	const handleEvent = useEffectEvent((event: IOrderStreamEvent) => {
		queryClient.invalidateQueries({ queryKey: [OrderQueryKeys.ORDERS, restaurantId] });

		if (event.type === 'ORDER_PLACED') {
			onOrderPlaced(event);
		}
	});

	useEffect(() => {
		if (!restaurantId) {
			return;
		}

		return OrdersService.subscribe(restaurantId, handleEvent);
	}, [restaurantId]);
}
