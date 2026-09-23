import { useState } from 'react';
import type { IOrder, OrderStatus } from 'shared/entities/IOrder';
import { useRestaurantGate } from 'shared/hooks/useRestaurantGate';

export function useOrdersController() {
	const { restaurantId, restaurantGate } = useRestaurantGate();

	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

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
		setSelectedOrder(order);
	}

	function handleCloseDetailsModal() {
		setSelectedOrder(null);
	}

	return {
		restaurantId,
		restaurantGate,
		isBoardVisible: restaurantGate === 'OPERATING',
		selectedOrder,
		handleSelectOrder,
		handleCloseDetailsModal,
		columns
	};
}
