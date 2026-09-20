import type { ICreateRestaurantPayload } from 'data/modules/restaurants/types/RestaurantTypes';
import { isValidCnpj } from 'shared/utils/isValidCnpj';
import { Mask } from 'shared/utils/Mask';
import { z } from 'zod';

const createRestaurantFormSchema = z.object({
	tradeName: z
		.string()
		.trim()
		.min(2, 'Informe o nome fantasia')
		.max(120, 'O nome fantasia deve ter no máximo 120 caracteres'),
	legalName: z
		.string()
		.trim()
		.min(2, 'Informe a razão social')
		.max(160, 'A razão social deve ter no máximo 160 caracteres'),
	cnpj: z.string(),
	phone: z.string(),
	email: z.string(),
	zipCode: z.string(),
	street: z
		.string()
		.trim()
		.min(2, 'Informe a rua')
		.max(160, 'A rua deve ter no máximo 160 caracteres'),
	number: z
		.string()
		.trim()
		.min(1, 'Informe o número')
		.max(20, 'O número deve ter no máximo 20 caracteres'),
	complement: z.string().max(80, 'O complemento deve ter no máximo 80 caracteres'),
	neighborhood: z
		.string()
		.trim()
		.min(2, 'Informe o bairro')
		.max(80, 'O bairro deve ter no máximo 80 caracteres'),
	city: z
		.string()
		.trim()
		.min(2, 'Informe a cidade')
		.max(80, 'A cidade deve ter no máximo 80 caracteres'),
	state: z.string()
});

export const createRestaurantSchema = createRestaurantFormSchema
	.superRefine((values, ctx) => {
		if (Mask.remove(values.cnpj).length !== 14) {
			ctx.addIssue({
				code: 'custom',
				path: ['cnpj'],
				message: 'Informe os 14 dígitos do CNPJ'
			});
		} else if (!isValidCnpj(values.cnpj)) {
			ctx.addIssue({
				code: 'custom',
				path: ['cnpj'],
				message: 'CNPJ inválido'
			});
		}

		if (Mask.remove(values.zipCode).length !== 8) {
			ctx.addIssue({
				code: 'custom',
				path: ['zipCode'],
				message: 'Informe os 8 dígitos do CEP'
			});
		}

		if (!/^[A-Za-z]{2}$/.test(values.state.trim())) {
			ctx.addIssue({
				code: 'custom',
				path: ['state'],
				message: 'Informe a UF com 2 letras'
			});
		}

		const phoneDigits = Mask.remove(values.phone);

		if (phoneDigits !== '' && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
			ctx.addIssue({
				code: 'custom',
				path: ['phone'],
				message: 'Informe um telefone válido com DDD'
			});
		}

		const email = values.email.trim();

		if (email !== '' && !z.email().safeParse(email).success) {
			ctx.addIssue({
				code: 'custom',
				path: ['email'],
				message: 'Formato de e-mail inválido'
			});
		}
	})
	.transform(
		(values): ICreateRestaurantPayload => ({
			tradeName: values.tradeName,
			legalName: values.legalName,
			cnpj: Mask.remove(values.cnpj),
			phone: Mask.remove(values.phone) || undefined,
			email: values.email.trim() || undefined,
			zipCode: Mask.remove(values.zipCode),
			street: values.street,
			number: values.number,
			complement: values.complement.trim() || undefined,
			neighborhood: values.neighborhood,
			city: values.city,
			state: values.state.trim().toUpperCase()
		})
	);

export type CreateRestaurantFormType = z.input<typeof createRestaurantSchema>;
export type CreateRestaurantPayloadType = z.output<typeof createRestaurantSchema>;
