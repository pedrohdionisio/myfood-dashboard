import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	MenuCategoryMutationKeys,
	MenuCategoryQueryKeys
} from 'data/modules/menuCategories/keys/MenuCategoryKeys';
import { MenuCategoriesService } from 'data/modules/menuCategories/services/MenuCategoriesService';
import type { ICreateMenuCategoryVariables } from 'data/modules/menuCategories/types/MenuCategoryTypes';

export function useCreateMenuCategory() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [MenuCategoryMutationKeys.CREATE_MENU_CATEGORY],
		mutationFn: ({ restaurantId, ...payload }: ICreateMenuCategoryVariables) =>
			MenuCategoriesService.create(restaurantId, payload),
		async onSuccess(_menuCategory, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [MenuCategoryQueryKeys.MENU_CATEGORIES, restaurantId]
			});
		}
	});

	return {
		createMenuCategory: mutateAsync,
		isCreatingMenuCategory: isPending
	};
}
