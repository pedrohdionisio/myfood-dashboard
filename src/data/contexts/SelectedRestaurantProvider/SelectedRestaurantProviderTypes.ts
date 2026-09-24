import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';

export type RestaurantGate = 'OPERATING' | 'MUST_ACTIVATE' | 'SUSPENDED' | 'NO_RESTAURANT';

export interface ISelectedRestaurantContextValue {
	selectedRestaurant: IRestaurantMembership | null;
	restaurantId: string | null;
	restaurantGate: RestaurantGate;
	selectRestaurant: (restaurantId: string) => void;
}
