import { describe, expect, it } from 'vitest';
import { formatPrepTime } from './formatPrepTime';

describe('formatPrepTime', () => {
	it('should show minutes below one hour and hours with padded minutes above', () => {
		expect(formatPrepTime(1500)).toBe('25 min');
		expect(formatPrepTime(3900)).toBe('1h 05');
	});
});
