import { describe, expect, it } from 'vitest';
import { isValidCnpj } from './isValidCnpj';

describe('isValidCnpj', () => {
	it('accepts a valid cnpj with or without mask', () => {
		expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
		expect(isValidCnpj('11222333000181')).toBe(true);
	});

	it('rejects wrong check digits', () => {
		expect(isValidCnpj('11.222.333/0001-82')).toBe(false);
	});

	it('rejects repeated digits', () => {
		expect(isValidCnpj('11111111111111')).toBe(false);
	});

	it('rejects the wrong length', () => {
		expect(isValidCnpj('1122233300018')).toBe(false);
	});
});
