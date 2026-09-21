import type { IMemberPayload } from 'data/modules/members/types/MemberTypes';
import { Mask } from 'shared/utils/Mask';
import { z } from 'zod';

const driverFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Informe o nome do entregador')
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

export const driverSchema = driverFormSchema
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
		(values): IMemberPayload => ({
			name: values.name,
			email: values.email,
			password: values.password,
			role: 'DRIVER',
			phone: Mask.remove(values.phone) || undefined
		})
	);

export type DriverFormType = z.input<typeof driverSchema>;
export type DriverPayloadType = z.output<typeof driverSchema>;
