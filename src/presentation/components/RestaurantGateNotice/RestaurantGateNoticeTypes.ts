import type { RestaurantGate } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProviderTypes';

export interface IRestaurantGateNoticeProps {
	gate: RestaurantGate;
	restaurantId: string;
}
