import type { ICuisineCategory } from 'shared/entities/ICuisineCategory';

export interface IRestaurantCuisinesFormProps {
	restaurantId: string;
	cuisineCatalog: ICuisineCategory[];
	restaurantCuisines: ICuisineCategory[];
}

export interface IUseRestaurantCuisinesFormControllerParams {
	restaurantId: string;
	restaurantCuisines: ICuisineCategory[];
}
