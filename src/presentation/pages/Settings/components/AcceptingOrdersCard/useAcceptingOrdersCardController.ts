import { getApiErrorMessage } from 'data/config/apiError';
import { useSetAcceptingOrders } from 'data/modules/restaurants/useCases/setAcceptingOrders/useSetAcceptingOrders';
import toast from 'react-hot-toast';
import type { IAcceptingOrdersCardProps } from './AcceptingOrdersCardTypes';

export function useAcceptingOrdersCardController({ restaurant }: IAcceptingOrdersCardProps) {
	const { setAcceptingOrders, isSettingAcceptingOrders } = useSetAcceptingOrders();

	async function handleToggleAcceptingOrders(isAcceptingOrders: boolean) {
		try {
			await setAcceptingOrders({ restaurantId: restaurant.id, isAcceptingOrders });

			toast.success(
				isAcceptingOrders
					? 'Loja voltou a receber pedidos.'
					: 'Loja pausada. Novos pedidos não entram.'
			);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		isAcceptingOrders: restaurant.isAcceptingOrders,
		isPublished: restaurant.status === 'ACTIVE',
		isSettingAcceptingOrders,
		handleToggleAcceptingOrders
	};
}
