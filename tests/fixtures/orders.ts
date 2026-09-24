import type { IOrdersPage } from 'data/modules/orders/types/OrderTypes';
import type { IOrder } from 'shared/entities/IOrder';
import { RESTAURANT_ID } from './restaurants';

export function buildOrder(overrides: Partial<IOrder> = {}): IOrder {
	return {
		id: 'order-1',
		displayNumber: 101,
		restaurantId: RESTAURANT_ID,
		customerId: 'customer-1',
		driverMemberId: null,
		customer: { name: 'Maria Souza', phone: '11912345678' },
		status: 'PENDING',
		paymentMethod: 'ONLINE',
		paymentStatus: 'PAID',
		changeForCents: null,
		subtotalCents: 5000,
		deliveryFeeCents: 700,
		discountCents: 0,
		totalCents: 5700,
		notes: null,
		deliveryZipCode: '01310100',
		deliveryStreet: 'Rua Augusta',
		deliveryNumber: '500',
		deliveryComplement: null,
		deliveryNeighborhood: 'Consolação',
		deliveryCity: 'São Paulo',
		deliveryState: 'SP',
		deliveryReference: null,
		cancellationReason: null,
		confirmedAt: null,
		readyAt: null,
		dispatchedAt: null,
		deliveredAt: null,
		finishedAt: null,
		createdAt: new Date().toISOString(),
		items: [
			{
				id: 'item-1',
				productId: 'product-1',
				productName: 'Lasanha',
				unitPriceCents: 2500,
				quantity: 2,
				totalCents: 5000,
				notes: null
			}
		],
		...overrides
	};
}

export function buildOrdersPage(
	items: IOrder[],
	overrides: Partial<IOrdersPage> = {}
): IOrdersPage {
	return { items, page: 1, perPage: 20, hasMore: false, ...overrides };
}
