import type { RestaurantStatus } from 'shared/entities/IRestaurant';

export type RestaurantGate =
	| 'OPERATING'
	| 'OWNER_MUST_ACTIVATE'
	| 'WAITING_OWNER'
	| 'SUSPENDED'
	| 'NO_RESTAURANT';

export function resolveRestaurantGate(
	status: RestaurantStatus | undefined,
	isOwner: boolean
): RestaurantGate {
	if (status === 'ACTIVE') {
		return 'OPERATING';
	}

	if (status === 'SUSPENDED') {
		return 'SUSPENDED';
	}

	if (status === 'DRAFT') {
		return isOwner ? 'OWNER_MUST_ACTIVATE' : 'WAITING_OWNER';
	}

	return 'NO_RESTAURANT';
}
