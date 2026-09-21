import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	MenuCategoryMutationKeys,
	MenuCategoryQueryKeys
} from 'data/modules/menuCategories/keys/MenuCategoryKeys';
import { MenuCategoriesService } from 'data/modules/menuCategories/services/MenuCategoriesService';
import type { IArchiveMenuCategoryVariables } from 'data/modules/menuCategories/types/MenuCategoryTypes';

export function useArchiveMenuCategory() {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [MenuCategoryMutationKeys.ARCHIVE_MENU_CATEGORY],
		mutationFn: ({ restaurantId, menuCategoryId }: IArchiveMenuCategoryVariables) =>
			MenuCategoriesService.archive(restaurantId, menuCategoryId),
		async onSuccess(_menuCategory, { restaurantId }) {
			await queryClient.invalidateQueries({
				queryKey: [MenuCategoryQueryKeys.MENU_CATEGORIES, restaurantId]
			});
		}
	});

	return {
		archiveMenuCategory: mutateAsync,
		isArchivingMenuCategory: isPending
	};
}
