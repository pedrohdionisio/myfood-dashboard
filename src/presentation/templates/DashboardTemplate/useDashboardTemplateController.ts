import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import type { IOrderStreamEvent } from 'data/modules/orders/types/OrderTypes';
import { useOrderStream } from 'data/modules/orders/useCases/watchOrders/useOrderStream';
import toast from 'react-hot-toast';

export function useDashboardTemplateController() {
	const { restaurantId, restaurantGate } = useSelectedRestaurant();

	function handleOrderPlaced({ displayNumber }: IOrderStreamEvent) {
		toast.success(`Novo pedido #${displayNumber}`);
	}

	useOrderStream({
		restaurantId: restaurantGate === 'OPERATING' ? restaurantId : null,
		onOrderPlaced: handleOrderPlaced
	});
}
