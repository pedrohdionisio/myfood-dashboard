import type { IOrder } from 'shared/entities/IOrder';

export interface IOrderDetailsModalProps {
	isOpen: boolean;
	restaurantId: string;
	order: IOrder | null;
	onClose: () => void;
}
