export interface IReplaceRestaurantCuisinesPayload {
	cuisineCategoryIds: string[];
}

export interface IReplaceRestaurantCuisinesVariables extends IReplaceRestaurantCuisinesPayload {
	restaurantId: string;
}
