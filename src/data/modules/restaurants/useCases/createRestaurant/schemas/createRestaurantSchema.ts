import {
	refineRestaurantProfile,
	restaurantProfileFields
} from 'data/modules/restaurants/schemas/restaurantProfileSchema';
import type { ICreateRestaurantPayload } from 'data/modules/restaurants/types/RestaurantTypes';
import { isValidCnpj } from 'shared/utils/isValidCnpj';
import { Mask } from 'shared/utils/Mask';
import { z } from 'zod';

const createRestaurantFormSchema = z.object({
	...restaurantProfileFields,
	cnpj: z.string()
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

		refineRestaurantProfile(values, ctx);
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
