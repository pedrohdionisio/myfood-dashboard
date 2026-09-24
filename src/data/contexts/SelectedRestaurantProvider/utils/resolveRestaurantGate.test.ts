import { describe, expect, it } from 'vitest';
import { resolveRestaurantGate } from './resolveRestaurantGate';

describe('resolveRestaurantGate', () => {
	it('should map each restaurant status to a gate', () => {
		expect(resolveRestaurantGate('ACTIVE')).toBe('OPERATING');
		expect(resolveRestaurantGate('DRAFT')).toBe('MUST_ACTIVATE');
		expect(resolveRestaurantGate('SUSPENDED')).toBe('SUSPENDED');
		expect(resolveRestaurantGate(undefined)).toBe('NO_RESTAURANT');
	});
});
