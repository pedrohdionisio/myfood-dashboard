import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';

export interface IRestaurantOptionProps {
	restaurant: IRestaurantMembership;
	onSelect: (restaurantId: string) => void;
}
