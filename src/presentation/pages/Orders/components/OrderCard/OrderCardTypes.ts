import type { IOrder } from 'shared/entities/IOrder';

export interface IOrderCardProps {
	order: IOrder;
	onSelect: (order: IOrder) => void;
}
