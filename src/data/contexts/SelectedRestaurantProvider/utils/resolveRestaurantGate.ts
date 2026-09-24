import type { RestaurantStatus } from 'shared/entities/IRestaurant';
import type { RestaurantGate } from '../SelectedRestaurantProviderTypes';

export function resolveRestaurantGate(status: RestaurantStatus | undefined): RestaurantGate {
	if (status === 'ACTIVE') {
		return 'OPERATING';
	}

	if (status === 'SUSPENDED') {
		return 'SUSPENDED';
	}

	if (status === 'DRAFT') {
		return 'MUST_ACTIVATE';
	}

	return 'NO_RESTAURANT';
}
