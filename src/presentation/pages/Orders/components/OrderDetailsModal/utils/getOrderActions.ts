import type { OrderTransition } from 'data/modules/orders/types/OrderTypes';
import type { OrderStatus } from 'shared/entities/IOrder';

export interface IOrderAction {
	transition: OrderTransition;
	label: string;
	confirmTitle: string;
	confirmDescription: string;
	isDestructive: boolean;
}

const ORDER_ACTIONS: Record<OrderStatus, IOrderAction[]> = {
	PENDING_PAYMENT: [],
	PENDING: [
		{
			transition: 'reject',
			label: 'Recusar',
			confirmTitle: 'Recusar pedido',
			confirmDescription:
				'O cliente é avisado e o pedido encerra aqui. Se o pagamento foi online, o estorno entra na fila.',
			isDestructive: true
		},
		{
			transition: 'confirm',
			label: 'Aceitar',
			confirmTitle: '',
			confirmDescription: '',
			isDestructive: false
		}
	],
	CONFIRMED: [
		{
			transition: 'cancel',
			label: 'Cancelar',
			confirmTitle: 'Cancelar pedido',
			confirmDescription:
				'Use quando não der para entregar o que foi aceito. O cliente é avisado e o pedido encerra aqui.',
			isDestructive: true
		},
		{
			transition: 'preparing',
			label: 'Pôr em preparo',
			confirmTitle: '',
			confirmDescription: '',
			isDestructive: false
		}
	],
	PREPARING: [
		{
			transition: 'cancel',
			label: 'Cancelar',
			confirmTitle: 'Cancelar pedido',
			confirmDescription:
				'Use quando não der para entregar o que já está em preparo. O cliente é avisado e o pedido encerra aqui.',
			isDestructive: true
		},
		{
			transition: 'ready',
			label: 'Marcar pronto',
			confirmTitle: '',
			confirmDescription: '',
			isDestructive: false
		}
	],
	READY: [],
	OUT_FOR_DELIVERY: [
		{
			transition: 'delivery-failed',
			label: 'Entrega frustrada',
			confirmTitle: 'Registrar entrega frustrada',
			confirmDescription:
				'Use quando o entregador não conseguiu entregar — cliente ausente, endereço errado. O pedido encerra aqui.',
			isDestructive: true
		}
	],
	DELIVERED: [],
	DELIVERY_FAILED: [],
	REJECTED: [],
	CANCELED: []
};

export function getOrderActions(status: OrderStatus): IOrderAction[] {
	return ORDER_ACTIONS[status];
}
