import { describe, expect, it } from 'vitest';
import { type CreateRestaurantFormType, createRestaurantSchema } from './createRestaurantSchema';

const validForm: CreateRestaurantFormType = {
	tradeName: 'Cantina da Nonna',
	legalName: 'Cantina da Nonna LTDA',
	cnpj: '11.222.333/0001-81',
	phone: '',
	email: '',
	zipCode: '01310-100',
	street: 'Avenida Paulista',
	number: '1000',
	complement: '',
	neighborhood: 'Bela Vista',
	city: 'São Paulo',
	state: 'sp'
};

function issuePaths(form: CreateRestaurantFormType) {
	return createRestaurantSchema.safeParse(form).error?.issues.map((issue) => issue.path[0]) ?? [];
}

describe('createRestaurantSchema', () => {
	it('sends digits only, uppercases the state and drops empty optionals', () => {
		expect(createRestaurantSchema.parse(validForm)).toEqual({
			tradeName: 'Cantina da Nonna',
			legalName: 'Cantina da Nonna LTDA',
			cnpj: '11222333000181',
			phone: undefined,
			email: undefined,
			zipCode: '01310100',
			street: 'Avenida Paulista',
			number: '1000',
			complement: undefined,
			neighborhood: 'Bela Vista',
			city: 'São Paulo',
			state: 'SP'
		});
	});

	it('rejects an invalid cnpj', () => {
		expect(issuePaths({ ...validForm, cnpj: '11.222.333/0001-82' })).toEqual(['cnpj']);
	});

	it('validates the shared profile fields', () => {
		expect(
			issuePaths({
				...validForm,
				zipCode: '0131',
				state: 'São Paulo',
				phone: '1198',
				email: 'contato@'
			})
		).toEqual(['zipCode', 'state', 'phone', 'email']);
	});
});
