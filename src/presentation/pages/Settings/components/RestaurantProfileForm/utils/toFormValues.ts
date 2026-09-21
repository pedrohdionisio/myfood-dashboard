import type { UpdateRestaurantFormType } from 'data/modules/restaurants/useCases/updateRestaurant/schemas/updateRestaurantSchema';
import type { IRestaurant } from 'shared/entities/IRestaurant';
import { Mask } from 'shared/utils/Mask';

export function toFormValues(restaurant: IRestaurant): UpdateRestaurantFormType {
	return {
		tradeName: restaurant.tradeName,
		legalName: restaurant.legalName,
		phone: restaurant.phone ? Mask.phone(restaurant.phone) : '',
		email: restaurant.email ?? '',
		description: restaurant.description ?? '',
		zipCode: Mask.zipCode(restaurant.zipCode),
		street: restaurant.street,
		number: restaurant.number,
		complement: restaurant.complement ?? '',
		neighborhood: restaurant.neighborhood,
		city: restaurant.city,
		state: restaurant.state,
		deliveryFee: Mask.currency(String(restaurant.deliveryFeeCents)),
		minOrder: Mask.currency(String(restaurant.minOrderCents)),
		avgPrepTimeMin: String(restaurant.avgPrepTimeMin)
	};
}
