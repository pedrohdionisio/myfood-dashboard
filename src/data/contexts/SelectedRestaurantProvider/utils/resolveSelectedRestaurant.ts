import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';

export function resolveSelectedRestaurant(
	myRestaurants: IRestaurantMembership[],
	storedRestaurantId: string | null
): IRestaurantMembership | null {
	if (myRestaurants.length === 1) {
		return myRestaurants[0] ?? null;
	}

	return myRestaurants.find(({ restaurantId }) => restaurantId === storedRestaurantId) ?? null;
}
