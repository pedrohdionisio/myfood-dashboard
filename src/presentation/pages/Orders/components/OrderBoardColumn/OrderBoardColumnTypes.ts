import type { IOrder } from 'shared/entities/IOrder';

export interface IOrderBoardColumnProps {
	label: string;
	orders: IOrder[];
	isLoadingOrders: boolean;
	ordersErrorMessage: string | null;
}
