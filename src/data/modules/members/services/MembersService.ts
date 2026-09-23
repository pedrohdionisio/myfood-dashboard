import { api } from 'data/config/api';
import type {
	ICreatedMember,
	IMemberPayload,
	IUpdateMemberPayload
} from 'data/modules/members/types/MemberTypes';
import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';

async function list(restaurantId: string): Promise<IRestaurantMember[]> {
	const { data } = await api.get<IRestaurantMember[]>(`/restaurants/${restaurantId}/members`);

	return data;
}

async function create(restaurantId: string, payload: IMemberPayload): Promise<ICreatedMember> {
	const { data } = await api.post<ICreatedMember>(`/restaurants/${restaurantId}/members`, payload);

	return data;
}

async function update(
	restaurantId: string,
	memberId: string,
	payload: IUpdateMemberPayload
): Promise<ICreatedMember> {
	const { data } = await api.patch<ICreatedMember>(
		`/restaurants/${restaurantId}/members/${memberId}`,
		payload
	);

	return data;
}

export const MembersService = {
	list,
	create,
	update
};
