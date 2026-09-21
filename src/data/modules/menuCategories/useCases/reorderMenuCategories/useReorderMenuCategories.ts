import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	MenuCategoryMutationKeys,
	MenuCategoryQueryKeys
} from 'data/modules/menuCategories/keys/MenuCategoryKeys';
import { MenuCategoriesService } from 'data/modules/menuCategories/services/MenuCategoriesService';
import type { IReorderMenuCategoriesVariables } from 'data/modules/menuCategories/types/MenuCategoryTypes';

export function useReorderMenuCategories() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [MenuCategoryMutationKeys.REORDER_MENU_CATEGORIES],
		mutationFn: ({ restaurantId, ...payload }: IReorderMenuCategoriesVariables) =>
			MenuCategoriesService.reorderMenuCategories(restaurantId, payload),
		onSuccess(menuCategories, { restaurantId }) {
			queryClient.setQueryData(
				[MenuCategoryQueryKeys.MENU_CATEGORIES, restaurantId],
				menuCategories
			);
		}
	});

	return {
		reorderMenuCategories: mutateAsync,
		isReorderingMenuCategories: isPending
	};
}
