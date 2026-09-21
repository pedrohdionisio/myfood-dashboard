import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useOrdersByStatus } from 'data/modules/orders/useCases/listOrders/useOrdersByStatus';

const BOARD_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'] as const;

type OrderBoardStatus = (typeof BOARD_STATUSES)[number];

const ORDER_COLUMN_LABELS: Record<OrderBoardStatus, string> = {
	PENDING: 'Novos',
	CONFIRMED: 'Aceitos',
	PREPARING: 'Em preparo',
	READY: 'Prontos',
	OUT_FOR_DELIVERY: 'Saiu para entrega'
};

export function useOrdersController() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const columns = useOrdersByStatus(restaurantId, BOARD_STATUSES).map((column) => ({
		status: column.status,
		label: ORDER_COLUMN_LABELS[column.status],
		orders: column.orders,
		hasMoreOrders: column.hasMoreOrders,
		isLoadingOrders: column.isLoadingOrders,
		ordersErrorMessage: column.ordersError ? getApiErrorMessage(column.ordersError) : null
	}));

	return {
		columns,
		hasTruncatedColumn: columns.some((column) => column.hasMoreOrders)
	};
}
