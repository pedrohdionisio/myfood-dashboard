import type { IOrderStreamEvent } from 'data/modules/orders/types/OrderTypes';
import { useOrderStream } from 'data/modules/orders/useCases/watchOrders/useOrderStream';
import toast from 'react-hot-toast';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

export function useDashboardTemplateController() {
	const { restaurantId, restaurantGate } = useRestaurantGate();

	function handleOrderPlaced({ displayNumber }: IOrderStreamEvent) {
		toast.success(`Novo pedido #${displayNumber}`);
	}

	useOrderStream({
		restaurantId: restaurantGate === 'OPERATING' ? restaurantId : null,
		onOrderPlaced: handleOrderPlaced
	});
}
