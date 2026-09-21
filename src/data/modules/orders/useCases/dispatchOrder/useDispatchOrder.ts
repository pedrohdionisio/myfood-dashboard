import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderMutationKeys, OrderQueryKeys } from 'data/modules/orders/keys/OrderKeys';
import { OrdersService } from 'data/modules/orders/services/OrdersService';
import type { IDispatchOrderVariables } from 'data/modules/orders/types/OrderTypes';

export function useDispatchOrder() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [OrderMutationKeys.DISPATCH_ORDER],
		mutationFn: ({ restaurantId, orderId, driverMemberId }: IDispatchOrderVariables) =>
			OrdersService.dispatch(restaurantId, orderId, driverMemberId),
		async onSuccess(_order, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [OrderQueryKeys.ORDERS, restaurantId]
			});
		}
	});

	return {
		dispatchOrder: mutateAsync,
		isDispatchingOrder: isPending
	};
}
