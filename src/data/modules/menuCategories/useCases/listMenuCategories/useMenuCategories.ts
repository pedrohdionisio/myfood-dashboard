import { skipToken, useQuery } from '@tanstack/react-query';
import { MenuCategoryQueryKeys } from 'data/modules/menuCategories/keys/MenuCategoryKeys';
import { MenuCategoriesService } from 'data/modules/menuCategories/services/MenuCategoriesService';

export function useMenuCategories(restaurantId: string | null) {
	const { data, isLoading, error } = useQuery({
		queryKey: [MenuCategoryQueryKeys.MENU_CATEGORIES, restaurantId],
		queryFn: restaurantId ? () => MenuCategoriesService.listMenuCategories(restaurantId) : skipToken
	});

	return {
		menuCategories: data ?? [],
		isLoadingMenuCategories: isLoading,
		menuCategoriesError: error
	};
}
