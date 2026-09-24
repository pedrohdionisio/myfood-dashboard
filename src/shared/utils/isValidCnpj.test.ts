import { describe, expect, it } from 'vitest';
import { isValidCnpj } from './isValidCnpj';

describe('isValidCnpj', () => {
	it('should accept a valid cnpj with or without mask', () => {
		expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
		expect(isValidCnpj('11222333000181')).toBe(true);
	});

	it('should reject wrong check digits', () => {
		expect(isValidCnpj('11.222.333/0001-82')).toBe(false);
	});

	it('should reject repeated digits', () => {
		expect(isValidCnpj('11111111111111')).toBe(false);
	});

	it('should reject the wrong length', () => {
		expect(isValidCnpj('1122233300018')).toBe(false);
	});
});
