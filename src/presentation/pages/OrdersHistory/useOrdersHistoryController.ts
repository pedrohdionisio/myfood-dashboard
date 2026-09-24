import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useOrders } from 'data/modules/orders/useCases/listOrders/useOrders';
import { useState } from 'react';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from 'shared/constants/orderLabels';
import type { OrderStatus } from 'shared/entities/IOrder';

const ALL_STATUSES_VALUE = 'ALL';

const PER_PAGE_OPTIONS = [
	{ value: '10', label: '10 por página' },
	{ value: '20', label: '20 por página' },
	{ value: '50', label: '50 por página' }
];

export function useOrdersHistoryController() {
	const { restaurantId, restaurantGate } = useSelectedRestaurant();

	const [selectedStatus, setSelectedStatus] = useState<string>(ALL_STATUSES_VALUE);
	const [perPage, setPerPage] = useState(20);
	const [page, setPage] = useState(1);

	const canSeeHistory = restaurantGate === 'OPERATING';

	const { orders, hasMoreOrders, isLoadingOrders, isFetchingOrders, ordersError } = useOrders(
		canSeeHistory ? restaurantId : null,
		{
			...(selectedStatus === ALL_STATUSES_VALUE ? {} : { status: selectedStatus as OrderStatus }),
			page,
			perPage
		}
	);

	function handleSelectStatus(value: string) {
		setSelectedStatus(value);
		setPage(1);
	}

	function handleSelectPerPage(value: string) {
		setPerPage(Number(value));
		setPage(1);
	}

	function handlePreviousPage() {
		setPage((currentPage) => Math.max(1, currentPage - 1));
	}

	function handleNextPage() {
		setPage((currentPage) => currentPage + 1);
	}

	return {
		restaurantId,
		restaurantGate,
		canSeeHistory,
		orders: orders.map((order) => ({
			id: order.id,
			displayNumber: order.displayNumber,
			createdAt: order.createdAt,
			customerName: order.customer.name,
			itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
			totalCents: order.totalCents,
			paymentMethodLabel: PAYMENT_METHOD_LABELS[order.paymentMethod],
			status: order.status,
			statusLabel: ORDER_STATUS_LABELS[order.status]
		})),
		statusOptions: [
			{ value: ALL_STATUSES_VALUE, label: 'Todos os status' },
			...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }))
		],
		perPageOptions: PER_PAGE_OPTIONS,
		selectedStatus,
		selectedPerPage: String(perPage),
		page,
		hasMoreOrders,
		isLoadingOrders,
		isFetchingOrders,
		ordersErrorMessage: ordersError ? getApiErrorMessage(ordersError) : null,
		isEmpty: !isLoadingOrders && !ordersError && orders.length === 0,
		handleSelectStatus,
		handleSelectPerPage,
		handlePreviousPage,
		handleNextPage
	};
}
