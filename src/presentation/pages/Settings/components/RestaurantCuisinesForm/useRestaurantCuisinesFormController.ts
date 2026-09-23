import { getApiErrorMessage } from 'data/config/apiError';
import { useReplaceRestaurantCuisines } from 'data/modules/cuisines/useCases/replaceRestaurantCuisines/useReplaceRestaurantCuisines';
import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { MAX_RESTAURANT_CUISINES } from 'shared/constants/cuisines';
import type { IUseRestaurantCuisinesFormControllerParams } from './RestaurantCuisinesFormTypes';
import { hasSameIds } from './utils/hasSameIds';

export function useRestaurantCuisinesFormController({
	restaurantId,
	restaurantCuisines
}: IUseRestaurantCuisinesFormControllerParams) {
	const { replaceRestaurantCuisines, isReplacingRestaurantCuisines } =
		useReplaceRestaurantCuisines();

	const savedIds = restaurantCuisines.map(({ id }) => id);
	const [selectedIds, setSelectedIds] = useState(savedIds);

	const isAtLimit = selectedIds.length >= MAX_RESTAURANT_CUISINES;

	function handleToggleCuisine(cuisineId: string) {
		setSelectedIds((currentIds) =>
			currentIds.includes(cuisineId)
				? currentIds.filter((id) => id !== cuisineId)
				: [...currentIds, cuisineId]
		);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		try {
			await replaceRestaurantCuisines({ restaurantId, cuisineCategoryIds: selectedIds });

			toast.success('Culinárias atualizadas.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		selectedIds,
		isDirty: !hasSameIds(selectedIds, savedIds),
		isAtLimit,
		maxCuisines: MAX_RESTAURANT_CUISINES,
		isReplacingRestaurantCuisines,
		handleToggleCuisine,
		handleSubmit
	};
}
