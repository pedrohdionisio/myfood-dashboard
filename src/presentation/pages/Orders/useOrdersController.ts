import { getApiErrorMessage } from 'data/config/apiError';
import { useOrdersByStatus } from 'data/modules/orders/useCases/listOrders/useOrdersByStatus';
import { useState } from 'react';
import type { IOrder } from 'shared/entities/IOrder';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

const BOARD_STATUSES = [
	'PENDING',
	'CONFIRMED',
	'PREPARING',
	'READY',
	'OUT_FOR_DELIVERY',
	'DELIVERED'
] as const;

type OrderBoardStatus = (typeof BOARD_STATUSES)[number];

const ORDER_COLUMN_LABELS: Record<OrderBoardStatus, string> = {
	PENDING: 'Novos',
	CONFIRMED: 'Aceitos',
	PREPARING: 'Em preparo',
	READY: 'Prontos',
	OUT_FOR_DELIVERY: 'Saiu para entrega',
	DELIVERED: 'Entregues'
};

export function useOrdersController() {
	const { restaurantId, restaurantGate } = useRestaurantGate();

	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

	const isBoardVisible = restaurantGate === 'OPERATING';

	const columns = useOrdersByStatus(isBoardVisible ? restaurantId : null, BOARD_STATUSES).map(
		(column) => ({
			status: column.status,
			label: ORDER_COLUMN_LABELS[column.status],
			orders: column.orders,
			hasMoreOrders: column.hasMoreOrders,
			isLoadingOrders: column.isLoadingOrders,
			ordersErrorMessage: column.ordersError ? getApiErrorMessage(column.ordersError) : null
		})
	);

	function handleSelectOrder(order: IOrder) {
		setSelectedOrder(order);
	}

	function handleCloseDetailsModal() {
		setSelectedOrder(null);
	}

	return {
		restaurantId,
		restaurantGate,
		isBoardVisible,
		selectedOrder,
		handleSelectOrder,
		handleCloseDetailsModal,
		columns,
		hasTruncatedColumn: columns.some((column) => column.hasMoreOrders)
	};
}
