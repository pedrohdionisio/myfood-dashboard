import type { IRestaurantMembership } from 'shared/entities/IRestaurantMembership';
import { describe, expect, it } from 'vitest';
import { resolveSelectedRestaurant } from './resolveSelectedRestaurant';

function membership(restaurantId: string): IRestaurantMembership {
	return { restaurantId, tradeName: restaurantId, role: 'OWNER', restaurantStatus: 'ACTIVE' };
}

describe('resolveSelectedRestaurant', () => {
	it('should pick the only restaurant regardless of the stored id', () => {
		expect(resolveSelectedRestaurant([membership('a')], 'other')?.restaurantId).toBe('a');
	});

	it('should pick the stored restaurant among many', () => {
		expect(resolveSelectedRestaurant([membership('a'), membership('b')], 'b')?.restaurantId).toBe(
			'b'
		);
	});

	it('should return null when the stored id is missing or unknown', () => {
		expect(resolveSelectedRestaurant([membership('a'), membership('b')], null)).toBeNull();
		expect(resolveSelectedRestaurant([membership('a'), membership('b')], 'c')).toBeNull();
		expect(resolveSelectedRestaurant([], 'a')).toBeNull();
	});
});
