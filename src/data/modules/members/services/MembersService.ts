import { api } from 'data/config/api';
import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';

async function list(restaurantId: string): Promise<IRestaurantMember[]> {
	const { data } = await api.get<IRestaurantMember[]>(`/restaurants/${restaurantId}/members`);

	return data;
}

export const MembersService = {
	list
};
