import type { MemberRole } from './IRestaurantMembership';

export interface IRestaurantMember {
	id: string;
	userId: string;
	name: string;
	email: string;
	phone: string | null;
	role: MemberRole;
	active: boolean;
}
