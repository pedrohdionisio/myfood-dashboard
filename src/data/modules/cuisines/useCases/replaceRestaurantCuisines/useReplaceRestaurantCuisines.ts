import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CuisineMutationKeys, CuisineQueryKeys } from 'data/modules/cuisines/keys/CuisineKeys';
import { CuisinesService } from 'data/modules/cuisines/services/CuisinesService';
import type { IReplaceRestaurantCuisinesVariables } from 'data/modules/cuisines/types/CuisineTypes';

export function useReplaceRestaurantCuisines() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [CuisineMutationKeys.REPLACE_RESTAURANT_CUISINES],
		mutationFn: ({ restaurantId, ...payload }: IReplaceRestaurantCuisinesVariables) =>
			CuisinesService.replace(restaurantId, payload),
		onSuccess(restaurantCuisines, { restaurantId }) {
			queryClient.setQueryData(
				[CuisineQueryKeys.RESTAURANT_CUISINES, restaurantId],
				restaurantCuisines
			);
		}
	});

	return {
		replaceRestaurantCuisines: mutateAsync,
		isReplacingRestaurantCuisines: isPending
	};
}
