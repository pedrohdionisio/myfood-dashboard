import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	RestaurantMutationKeys,
	RestaurantQueryKeys
} from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';
import type { ISetAcceptingOrdersVariables } from 'data/modules/restaurants/types/RestaurantTypes';

export function useSetAcceptingOrders() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [RestaurantMutationKeys.SET_ACCEPTING_ORDERS],
		mutationFn: ({ restaurantId, isAcceptingOrders }: ISetAcceptingOrdersVariables) =>
			RestaurantsService.setAcceptingOrders(restaurantId, isAcceptingOrders),
		onSuccess(restaurant, { restaurantId }) {
			queryClient.setQueryData([RestaurantQueryKeys.RESTAURANT, restaurantId], restaurant);
		}
	});

	return {
		setAcceptingOrders: mutateAsync,
		isSettingAcceptingOrders: isPending
	};
}
