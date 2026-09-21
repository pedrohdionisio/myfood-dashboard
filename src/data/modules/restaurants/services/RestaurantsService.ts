import { api } from 'data/config/api';
import type { ICreateRestaurantPayload } from 'data/modules/restaurants/types/RestaurantTypes';
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

export const RestaurantsService = {
	listMine,
	create
};
