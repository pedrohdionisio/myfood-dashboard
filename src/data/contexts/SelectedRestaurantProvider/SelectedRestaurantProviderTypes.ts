import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';

export interface ISelectedRestaurantContextValue {
	selectedRestaurant: IRestaurantMembership | null;
	selectRestaurant: (restaurantId: string) => void;
}
