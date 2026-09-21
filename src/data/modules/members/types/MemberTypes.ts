import type { MemberRole } from 'shared/entities/IRestaurantMembership';

export interface IMemberPayload {
	name: string;
	email: string;
	password: string;
	role: MemberRole;
	phone?: string;
}

export interface ICreateMemberVariables extends IMemberPayload {
	restaurantId: string;
}

export interface ICreatedMember {
	membership: {
		id: string;
		restaurantId: string;
		userId: string;
		role: MemberRole;
		active: boolean;
	};
	user: {
		id: string;
		name: string;
		email: string;
	};
}
