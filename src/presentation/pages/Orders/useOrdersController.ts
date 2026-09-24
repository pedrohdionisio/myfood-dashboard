import { useBoardOrder } from 'data/modules/orders/useCases/findBoardOrder/useBoardOrder';
import { useState } from 'react';
import type { IOrder, OrderStatus } from 'shared/entities/IOrder';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

export function useOrdersController() {
	const { restaurantId, restaurantGate } = useRestaurantGate();

	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const { boardOrder } = useBoardOrder(restaurantId, selectedOrderId);

	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);

	const columns: { status: OrderStatus; label: string; createdSince?: string }[] = [
		{ status: 'PENDING', label: 'Novos' },
		{ status: 'CONFIRMED', label: 'Aceitos' },
		{ status: 'PREPARING', label: 'Em preparo' },
		{ status: 'READY', label: 'Prontos' },
		{ status: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' },
		{ status: 'DELIVERED', label: 'Entregues hoje', createdSince: startOfToday.toISOString() }
	];

	function handleSelectOrder(order: IOrder) {
		setSelectedOrderId(order.id);
	}

	function handleCloseDetailsModal() {
		setSelectedOrderId(null);
	}

	return {
		restaurantId,
		restaurantGate,
		isBoardVisible: restaurantGate === 'OPERATING',
		selectedOrder: boardOrder,
		handleSelectOrder,
		handleCloseDetailsModal,
		columns
	};
}
