import { describe, expect, it } from 'vitest';
import { signUpSchema } from './signUpSchema';

const validForm = {
	name: 'Pedro',
	email: 'pedro@myfood.com',
	phone: '',
	password: 'Senha123'
};

describe('signUpSchema', () => {
	it('should send the phone digits or leave it out', () => {
		expect(signUpSchema.parse({ ...validForm, phone: '(11) 98765-4321' }).phone).toBe(
			'11987654321'
		);
		expect(signUpSchema.parse(validForm).phone).toBeUndefined();
	});

	it('should reject an incomplete phone', () => {
		const result = signUpSchema.safeParse({ ...validForm, phone: '(11) 9876' });

		expect(result.error?.issues[0]?.path).toEqual(['phone']);
	});

	it('should require upper, lower case and a digit in the password', () => {
		const result = signUpSchema.safeParse({ ...validForm, password: 'senhafraca' });

		expect(result.error?.issues[0]?.message).toBe(
			'A senha precisa de letra maiúscula, letra minúscula e número'
		);
	});
});
