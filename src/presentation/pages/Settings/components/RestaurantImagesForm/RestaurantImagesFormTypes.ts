import type { ImageKind } from 'data/modules/uploads/types/UploadTypes';
import type { IRestaurant } from 'shared/entities/IRestaurant';

export type RestaurantImageKind = Extract<ImageKind, 'RESTAURANT_LOGO' | 'RESTAURANT_BANNER'>;

export interface IRestaurantImagesFormProps {
	restaurant: IRestaurant;
}
