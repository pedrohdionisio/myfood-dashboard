import { describe, expect, it } from 'vitest';
import { resetPasswordSchema } from './resetPasswordSchema';

describe('resetPasswordSchema', () => {
	it('drops the confirmation from the payload', () => {
		expect(
			resetPasswordSchema.parse({
				code: ' 123456 ',
				password: 'Senha123',
				passwordConfirmation: 'Senha123'
			})
		).toEqual({ code: '123456', password: 'Senha123' });
	});

	it('flags a confirmation that does not match', () => {
		const result = resetPasswordSchema.safeParse({
			code: '123456',
			password: 'Senha123',
			passwordConfirmation: 'Senha124'
		});

		expect(result.error?.issues[0]?.path).toEqual(['passwordConfirmation']);
	});
});
