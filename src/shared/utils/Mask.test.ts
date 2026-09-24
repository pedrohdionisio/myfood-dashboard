import { describe, expect, it } from 'vitest';
import { Mask } from './Mask';

describe('Mask', () => {
	it('should remove every non-digit character', () => {
		expect(Mask.remove('(11) 98765-4321')).toBe('11987654321');
	});

	it('should format a cnpj and ignore extra digits', () => {
		expect(Mask.cnpj('112223330001819999')).toBe('11.222.333/0001-81');
	});

	it('should format a partial cnpj as the user types', () => {
		expect(Mask.cnpj('11222')).toBe('11.222');
	});

	it('should format a zip code', () => {
		expect(Mask.zipCode('01310100')).toBe('01310-100');
	});

	it('should format landline and mobile phones', () => {
		expect(Mask.phone('1133334444')).toBe('(11) 3333-4444');
		expect(Mask.phone('11987654321')).toBe('(11) 98765-4321');
	});

	it('should format currency from cents typed as digits', () => {
		expect(Mask.currency('5')).toBe('0,05');
		expect(Mask.currency('3990')).toBe('39,90');
		expect(Mask.currency('123456789')).toBe('1.234.567,89');
	});

	it('should return an empty string for currency without digits', () => {
		expect(Mask.currency('R$ ')).toBe('');
	});

	it('should cap currency at eleven digits', () => {
		expect(Mask.currency('999999999999999')).toBe('999.999.999,99');
	});
});
