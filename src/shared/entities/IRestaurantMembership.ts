import type { RestaurantStatus } from './IRestaurant';

const MEMBER_ROLES = ['OWNER', 'DRIVER'] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

export interface IRestaurantMembership {
	restaurantId: string;
	tradeName: string;
	role: MemberRole;
	restaurantStatus: RestaurantStatus;
}
