import { useBoardOrder } from 'data/modules/orders/useCases/findBoardOrder/useBoardOrder';
import { useState } from 'react';
import type { IOrder, OrderStatus } from 'shared/entities/IOrder';
import { useBusinessDate } from 'shared/hooks/useBusinessDate';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

export function useOrdersController() {
	const { restaurantId, restaurantGate } = useRestaurantGate();

	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const { boardOrder } = useBoardOrder(restaurantId, selectedOrderId);

	const today = useBusinessDate();

	const columns: { status: OrderStatus; label: string; deliveredSince?: string }[] = [
		{ status: 'PENDING', label: 'Novos' },
		{ status: 'CONFIRMED', label: 'Aceitos' },
		{ status: 'PREPARING', label: 'Em preparo' },
		{ status: 'READY', label: 'Prontos' },
		{ status: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' },
		{ status: 'DELIVERED', label: 'Entregues hoje', deliveredSince: `${today}T00:00:00-03:00` }
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
