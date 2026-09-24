import { describe, expect, it } from 'vitest';
import { hasSameIds } from './hasSameIds';

describe('hasSameIds', () => {
	it('compares ids regardless of order', () => {
		expect(hasSameIds(['a', 'b'], ['b', 'a'])).toBe(true);
		expect(hasSameIds(['a', 'b'], ['a', 'c'])).toBe(false);
		expect(hasSameIds(['a'], ['a', 'b'])).toBe(false);
	});
});
