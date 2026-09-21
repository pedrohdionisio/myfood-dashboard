import { api } from 'data/config/api';
import type { ICreateRestaurantPayload } from 'data/modules/restaurants/types/RestaurantTypes';
import type { IActivationChecklist } from 'shared/entities/IActivationChecklist';
import type { IRestaurant } from 'shared/entities/IRestaurant';
import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';

async function listMine(): Promise<IRestaurantMembership[]> {
	const { data } = await api.get<IRestaurantMembership[]>('/restaurant-users/me/restaurants');

	return data;
}

async function create(payload: ICreateRestaurantPayload): Promise<IRestaurant> {
	const { data } = await api.post<IRestaurant>('/restaurants', payload);

	return data;
}

async function getActivationChecklist(restaurantId: string): Promise<IActivationChecklist> {
	const { data } = await api.get<IActivationChecklist>(
		`/restaurants/${restaurantId}/activation-checklist`
	);

	return data;
}

async function activate(restaurantId: string): Promise<IRestaurant> {
	const { data } = await api.patch<IRestaurant>(`/restaurants/${restaurantId}/status`, {
		status: 'ACTIVE'
	});

	return data;
}

export const RestaurantsService = {
	listMine,
	create,
	getActivationChecklist,
	activate
};
