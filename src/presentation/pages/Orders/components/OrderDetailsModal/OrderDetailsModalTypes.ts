import type { OrderTransition } from 'data/modules/orders/types/OrderTypes';
import type { IOrder } from 'shared/entities/IOrder';

export interface IOrderDetailsModalProps {
	isOpen: boolean;
	restaurantId: string;
	order: IOrder | null;
	onClose: () => void;
}

export interface IOrderAction {
	transition: OrderTransition;
	label: string;
	confirmTitle: string;
	confirmDescription: string;
	isDestructive: boolean;
}
