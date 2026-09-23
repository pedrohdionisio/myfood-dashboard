import { api } from 'data/config/api';
import type { IReplaceRestaurantCuisinesPayload } from 'data/modules/cuisines/types/CuisineTypes';
import type { ICuisineCategory } from 'shared/entities/ICuisineCategory';

async function listCatalog(): Promise<ICuisineCategory[]> {
	const { data } = await api.get<ICuisineCategory[]>('/cuisine-categories');

	return data;
}

async function listByRestaurant(restaurantId: string): Promise<ICuisineCategory[]> {
	const { data } = await api.get<ICuisineCategory[]>(`/restaurants/${restaurantId}/cuisines`);

	return data;
}

async function replace(
	restaurantId: string,
	payload: IReplaceRestaurantCuisinesPayload
): Promise<ICuisineCategory[]> {
	const { data } = await api.put<ICuisineCategory[]>(
		`/restaurants/${restaurantId}/cuisines`,
		payload
	);

	return data;
}

export const CuisinesService = {
	listCatalog,
	listByRestaurant,
	replace
};
