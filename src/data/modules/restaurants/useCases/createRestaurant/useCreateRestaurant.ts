import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	RestaurantMutationKeys,
	RestaurantQueryKeys
} from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';

export function useCreateRestaurant() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [RestaurantMutationKeys.CREATE_RESTAURANT],
		mutationFn: RestaurantsService.create,
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: [RestaurantQueryKeys.MY_RESTAURANTS] });
		}
	});

	return {
		createRestaurant: mutateAsync,
		isCreatingRestaurant: isPending
	};
}
