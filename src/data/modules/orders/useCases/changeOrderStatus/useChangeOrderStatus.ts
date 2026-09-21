import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderMutationKeys, OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IChangeOrderStatusVariables } from 'data/modules/orders/types/OrderTypes';

export function useChangeOrderStatus() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending, variables } = useMutation({
		mutationKey: [OrderMutationKeys.CHANGE_ORDER_STATUS],
		mutationFn: ({ restaurantId, orderId, transition, reason }: IChangeOrderStatusVariables) =>
			OrdersService.changeStatus(restaurantId, orderId, transition, reason),
		async onSuccess(_order, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [OrderQueryKeys.ORDERS, restaurantId]
			});
		}
	});

	return {
		changeOrderStatus: mutateAsync,
		isChangingOrderStatus: isPending,
		changingTransition: isPending && variables ? variables.transition : null
	};
}
