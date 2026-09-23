import { passwordSchema } from 'data/modules/auth/schemas/passwordSchema';
import { z } from 'zod';

export const resetPasswordSchema = z
	.object({
		code: z.string().trim().min(4, 'Informe o código que chegou por e-mail').max(32),
		password: passwordSchema,
		passwordConfirmation: z.string()
	})
	.refine((values) => values.password === values.passwordConfirmation, {
		path: ['passwordConfirmation'],
		message: 'As senhas não conferem'
	})
	.transform(({ code, password }) => ({ code, password }));

export type ResetPasswordFormType = z.input<typeof resetPasswordSchema>;
export type ResetPasswordPayloadType = z.output<typeof resetPasswordSchema>;
