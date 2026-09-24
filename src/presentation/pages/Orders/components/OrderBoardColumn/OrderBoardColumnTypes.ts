import type { IOrder, OrderStatus } from 'shared/entities/IOrder';

export interface IOrderBoardColumnProps {
	restaurantId: string;
	status: OrderStatus;
	label: string;
	deliveredSince?: string;
	onSelectOrder: (order: IOrder) => void;
}
