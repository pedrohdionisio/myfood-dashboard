import { skipToken, useQuery } from '@tanstack/react-query';
import { RestaurantQueryKeys } from 'data/modules/restaurants/keys/RestaurantKeys';
import { RestaurantsService } from 'data/modules/restaurants/services/RestaurantsService';

export function useActivationChecklist(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [RestaurantQueryKeys.ACTIVATION_CHECKLIST, restaurantId],
		queryFn: restaurantId
			? () => RestaurantsService.getActivationChecklist(restaurantId)
			: skipToken
	});

	return {
		activationChecklist: data ?? null,
		isLoadingActivationChecklist: isLoading,
		activationChecklistError: error
	};
}
