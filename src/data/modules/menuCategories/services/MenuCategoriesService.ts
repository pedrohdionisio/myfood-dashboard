import { api } from 'data/config/api';
import type {
	IMenuCategoryPayload,
	IReorderMenuCategoriesPayload
} from 'data/modules/menuCategories/types/MenuCategoryTypes';
import type { IMenuCategory } from 'shared/entities/IMenuCategory';

async function list(restaurantId: string): Promise<IMenuCategory[]> {
	const { data } = await api.get<IMenuCategory[]>(`/restaurants/${restaurantId}/menu-categories`);

	return data;
}

async function create(restaurantId: string, payload: IMenuCategoryPayload): Promise<IMenuCategory> {
	const { data } = await api.post<IMenuCategory>(
		`/restaurants/${restaurantId}/menu-categories`,
		payload
	);

	return data;
}

async function update(
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

async function archive(restaurantId: string, menuCategoryId: string): Promise<IMenuCategory> {
	const { data } = await api.delete<IMenuCategory>(
		`/restaurants/${restaurantId}/menu-categories/${menuCategoryId}`
	);

	return data;
}

async function reorder(
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
	list,
	create,
	update,
	archive,
	reorder
};
