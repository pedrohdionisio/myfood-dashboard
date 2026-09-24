import type { OrderStatus, PaymentMethod } from 'shared/entities/IOrder';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	PENDING_PAYMENT: 'Aguardando pagamento',
	PENDING: 'Novo',
	CONFIRMED: 'Aceito',
	PREPARING: 'Em preparo',
	READY: 'Pronto',
	OUT_FOR_DELIVERY: 'Saiu para entrega',
	DELIVERED: 'Entregue',
	DELIVERY_FAILED: 'Entrega frustrada',
	REJECTED: 'Recusado',
	CANCELED: 'Cancelado'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	ONLINE: 'Pix',
	CASH: 'Dinheiro',
	CARD_ON_DELIVERY: 'Cartão na entrega'
};
