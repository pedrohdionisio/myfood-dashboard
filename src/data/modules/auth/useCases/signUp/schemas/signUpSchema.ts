import type { ISignUpPayload } from 'data/modules/auth/types/AuthTypes';
import { Mask } from 'shared/utils/Mask';
import { z } from 'zod';

const signUpFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Informe seu nome')
		.max(120, 'O nome deve ter no máximo 120 caracteres'),
	email: z.email('Formato de e-mail inválido').max(254, 'O e-mail é muito longo'),
	phone: z.string(),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.max(128, 'A senha deve ter no máximo 128 caracteres')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'A senha precisa de letra maiúscula, letra minúscula e número'
		)
});

export const signUpSchema = signUpFormSchema
	.superRefine((values, ctx) => {
		const phoneDigits = Mask.remove(values.phone);

		if (phoneDigits !== '' && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
			ctx.addIssue({
				code: 'custom',
				path: ['phone'],
				message: 'Informe um telefone válido com DDD'
			});
		}
	})
	.transform(
		(values): ISignUpPayload => ({
			name: values.name,
			email: values.email,
			password: values.password,
			phone: Mask.remove(values.phone) || undefined
		})
	);

export type SignUpFormType = z.input<typeof signUpSchema>;
export type SignUpPayloadType = z.output<typeof signUpSchema>;
