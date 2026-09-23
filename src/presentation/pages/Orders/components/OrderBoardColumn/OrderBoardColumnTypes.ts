import type { IOrder, OrderStatus } from 'shared/entities/IOrder';

export interface IOrderBoardColumnProps {
	restaurantId: string;
	status: OrderStatus;
	label: string;
	createdSince?: string;
	onSelectOrder: (order: IOrder) => void;
}
