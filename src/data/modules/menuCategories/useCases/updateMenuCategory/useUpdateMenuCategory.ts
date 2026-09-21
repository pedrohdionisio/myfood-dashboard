import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	MenuCategoryMutationKeys,
	MenuCategoryQueryKeys
} from 'data/modules/menuCategories/keys/MenuCategoryKeys';
import { MenuCategoriesService } from 'data/modules/menuCategories/services/MenuCategoriesService';
import type { IUpdateMenuCategoryVariables } from 'data/modules/menuCategories/types/MenuCategoryTypes';

export function useUpdateMenuCategory() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [MenuCategoryMutationKeys.UPDATE_MENU_CATEGORY],
		mutationFn: ({ restaurantId, menuCategoryId, ...payload }: IUpdateMenuCategoryVariables) =>
			MenuCategoriesService.update(restaurantId, menuCategoryId, payload),
		async onSuccess(_menuCategory, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [MenuCategoryQueryKeys.MENU_CATEGORIES, restaurantId]
			});
		}
	});

	return {
		updateMenuCategory: mutateAsync,
		isUpdatingMenuCategory: isPending
	};
}
