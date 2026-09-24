export type OrderStatus =
	| 'PENDING_PAYMENT'
	| 'PENDING'
	| 'CONFIRMED'
	| 'PREPARING'
	| 'READY'
	| 'OUT_FOR_DELIVERY'
	| 'DELIVERED'
	| 'DELIVERY_FAILED'
	| 'REJECTED'
	| 'CANCELED';

export type PaymentMethod = 'ONLINE' | 'CASH' | 'CARD_ON_DELIVERY';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

interface IOrderItem {
	id: string;
	productId: string;
	productName: string;
	unitPriceCents: number;
	quantity: number;
	totalCents: number;
	notes: string | null;
}

interface IOrderCustomer {
	name: string;
	phone: string | null;
}

export interface IOrder {
	id: string;
	displayNumber: number;
	restaurantId: string;
	customerId: string;
	driverMemberId: string | null;
	customer: IOrderCustomer;
	status: OrderStatus;
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	changeForCents: number | null;
	subtotalCents: number;
	deliveryFeeCents: number;
	discountCents: number;
	totalCents: number;
	notes: string | null;
	deliveryZipCode: string;
	deliveryStreet: string;
	deliveryNumber: string;
	deliveryComplement: string | null;
	deliveryNeighborhood: string;
	deliveryCity: string;
	deliveryState: string;
	deliveryReference: string | null;
	cancellationReason: string | null;
	confirmedAt: string | null;
	readyAt: string | null;
	dispatchedAt: string | null;
	deliveredAt: string | null;
	finishedAt: string | null;
	createdAt: string;
	items: IOrderItem[];
}
