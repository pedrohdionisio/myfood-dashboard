import { describe, expect, it } from 'vitest';
import { toStatDelta } from './toStatDelta';

describe('toStatDelta', () => {
	it('should return the rounded percentage change', () => {
		expect(toStatDelta(150, 100)).toBe(50);
		expect(toStatDelta(2, 3)).toBe(-33);
	});

	it('should have no base to compare with a zero previous value', () => {
		expect(toStatDelta(10, 0)).toBeNull();
	});
});
