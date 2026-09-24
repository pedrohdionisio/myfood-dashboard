import { describe, expect, it } from 'vitest';
import { productSchema } from './productSchema';

const validForm = {
	menuCategoryId: '5b1f0f5e-7c1a-4c55-9d7e-1a2b3c4d5e6f',
	name: 'Lasanha',
	description: ' Bolonhesa ',
	price: '39,90',
	imageKey: null
};

describe('productSchema', () => {
	it('converts the price to cents and trims the description', () => {
		expect(productSchema.parse(validForm)).toEqual({
			menuCategoryId: validForm.menuCategoryId,
			name: 'Lasanha',
			description: 'Bolonhesa',
			priceCents: 3990,
			imageKey: null
		});
	});

	it('requires a price and a category', () => {
		const result = productSchema.safeParse({ ...validForm, price: '', menuCategoryId: '' });

		expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['menuCategoryId', 'price']);
	});
});
