import { api } from 'data/config/api';
import type {
	IMenuCategoryPayload,
	IReorderMenuCategoriesPayload
} from 'data/modules/menuCategories/types/MenuCategoryTypes';
import type { IMenuCategory } from 'shared/entities/IMenuCategory';

async function listMenuCategories(restaurantId: string): Promise<IMenuCategory[]> {
	const { data } = await api.get<IMenuCategory[]>(`/restaurants/${restaurantId}/menu-categories`);

	return data;
}

async function createMenuCategory(
	restaurantId: string,
	payload: IMenuCategoryPayload
): Promise<IMenuCategory> {
	const { data } = await api.post<IMenuCategory>(
		`/restaurants/${restaurantId}/menu-categories`,
		payload
	);

	return data;
}

async function updateMenuCategory(
	restaurantId: string,
	menuCategoryId: string,
	payload: IMenuCategoryPayload
): Promise<IMenuCategory> {
	const { data } = await api.patch<IMenuCategory>(
		`/restaurants/${restaurantId}/menu-categories/${menuCategoryId}`,
		payload
	);

	return data;
}

async function archiveMenuCategory(
	restaurantId: string,
	menuCategoryId: string
): Promise<IMenuCategory> {
	const { data } = await api.delete<IMenuCategory>(
		`/restaurants/${restaurantId}/menu-categories/${menuCategoryId}`
	);

	return data;
}

async function reorderMenuCategories(
	restaurantId: string,
	payload: IReorderMenuCategoriesPayload
): Promise<IMenuCategory[]> {
	const { data } = await api.patch<IMenuCategory[]>(
		`/restaurants/${restaurantId}/menu-categories/reorder`,
		payload
	);

	return data;
}

export const MenuCategoriesService = {
	listMenuCategories,
	createMenuCategory,
	updateMenuCategory,
	archiveMenuCategory,
	reorderMenuCategories
};
