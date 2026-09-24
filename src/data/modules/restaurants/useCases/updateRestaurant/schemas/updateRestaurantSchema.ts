import {
	refineRestaurantProfile,
	restaurantProfileFields
} from 'data/modules/restaurants/schemas/restaurantProfileSchema';
import type { IUpdateRestaurantPayload } from 'data/modules/restaurants/types/RestaurantTypes';
import { Mask } from 'shared/utils/Mask';
import { z } from 'zod';

const updateRestaurantFormSchema = z.object({
	...restaurantProfileFields,
	description: z.string().max(2000, 'A descrição deve ter no máximo 2000 caracteres'),
	deliveryFee: z.string(),
	minOrder: z.string(),
	avgPrepTimeMin: z.string()
});

export const updateRestaurantSchema = updateRestaurantFormSchema
	.superRefine((values, ctx) => {
		refineRestaurantProfile(values, ctx);

		const avgPrepTime = Number(Mask.remove(values.avgPrepTimeMin));

		if (!avgPrepTime || avgPrepTime < 1 || avgPrepTime > 240) {
			ctx.addIssue({
				code: 'custom',
				path: ['avgPrepTimeMin'],
				message: 'Informe o tempo de preparo entre 1 e 240 minutos'
			});
		}
	})
	.transform((values): IUpdateRestaurantPayload => {
		const phone = Mask.remove(values.phone);
		const email = values.email.trim();

		return {
			tradeName: values.tradeName,
			legalName: values.legalName,
			...(phone ? { phone } : {}),
			...(email ? { email } : {}),
			description: values.description.trim(),
			zipCode: Mask.remove(values.zipCode),
			street: values.street,
			number: values.number,
			complement: values.complement.trim(),
			neighborhood: values.neighborhood,
			city: values.city,
			state: values.state.trim().toUpperCase(),
			deliveryFeeCents: Number(Mask.remove(values.deliveryFee) || 0),
			minOrderCents: Number(Mask.remove(values.minOrder) || 0),
			avgPrepTimeMin: Number(Mask.remove(values.avgPrepTimeMin))
		};
	});

export type UpdateRestaurantFormType = z.input<typeof updateRestaurantSchema>;
export type UpdateRestaurantPayloadType = z.output<typeof updateRestaurantSchema>;
