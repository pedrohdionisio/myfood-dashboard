import { describe, expect, it } from 'vitest';
import { toBusinessDate } from './toBusinessDate';

describe('toBusinessDate', () => {
	it('should use the São Paulo calendar day', () => {
		expect(toBusinessDate(new Date('2026-09-24T02:30:00Z'))).toBe('2026-09-23');
		expect(toBusinessDate(new Date('2026-09-24T03:30:00Z'))).toBe('2026-09-24');
	});
});
