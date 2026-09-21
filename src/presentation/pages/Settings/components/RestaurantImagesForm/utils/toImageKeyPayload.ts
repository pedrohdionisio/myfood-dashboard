import type { IUpdateRestaurantPayload } from 'data/modules/restaurants/types/RestaurantTypes';
import type { RestaurantImageKind } from '../RestaurantImagesFormTypes';

export function toImageKeyPayload(
	kind: RestaurantImageKind,
	imageKey: string | null
): IUpdateRestaurantPayload {
	return kind === 'RESTAURANT_LOGO' ? { logoKey: imageKey } : { bannerKey: imageKey };
}
