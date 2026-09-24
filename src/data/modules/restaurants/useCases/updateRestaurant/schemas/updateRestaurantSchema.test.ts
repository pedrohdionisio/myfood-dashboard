import { describe, expect, it } from 'vitest';
import { type UpdateRestaurantFormType, updateRestaurantSchema } from './updateRestaurantSchema';

const validForm: UpdateRestaurantFormType = {
	tradeName: 'Cantina da Nonna',
	legalName: 'Cantina da Nonna LTDA',
	phone: '(11) 98765-4321',
	email: '',
	description: ' Massas artesanais ',
	zipCode: '01310-100',
	street: 'Avenida Paulista',
	number: '1000',
	complement: '',
	neighborhood: 'Bela Vista',
	city: 'São Paulo',
	state: 'SP',
	deliveryFee: '7,00',
	minOrder: '',
	avgPrepTimeMin: '30'
};

describe('updateRestaurantSchema', () => {
	it('converts money to cents and omits an empty email', () => {
		const payload = updateRestaurantSchema.parse(validForm);

		expect(payload).toMatchObject({
			phone: '11987654321',
			description: 'Massas artesanais',
			deliveryFeeCents: 700,
			minOrderCents: 0,
			avgPrepTimeMin: 30
		});
		expect(payload).not.toHaveProperty('email');
	});

	it('limits the preparation time between 1 and 240 minutes', () => {
		const result = updateRestaurantSchema.safeParse({ ...validForm, avgPrepTimeMin: '241' });

		expect(result.error?.issues[0]?.path).toEqual(['avgPrepTimeMin']);
	});
});
