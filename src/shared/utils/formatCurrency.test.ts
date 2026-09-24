import { describe, expect, it } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
	it('formats cents as brazilian reais', () => {
		expect(formatCurrency(1590)).toBe('R$ 15,90');
		expect(formatCurrency(123456)).toBe('R$ 1.234,56');
		expect(formatCurrency(0)).toBe('R$ 0,00');
	});
});
