import type { IProductPayload } from 'data/modules/products/types/ProductTypes';
import { Mask } from 'shared/utils/Mask';
import { z } from 'zod';

const productFormSchema = z.object({
	menuCategoryId: z.uuid('Escolha a categoria do produto'),
	name: z
		.string()
		.trim()
		.min(2, 'O nome deve ter ao menos 2 caracteres')
		.max(120, 'O nome deve ter no máximo 120 caracteres'),
	description: z.string().max(2000, 'A descrição deve ter no máximo 2000 caracteres'),
	price: z.string()
});

export const productSchema = productFormSchema
	.superRefine((values, ctx) => {
		if (Mask.remove(values.price) === '') {
			ctx.addIssue({
				code: 'custom',
				path: ['price'],
				message: 'Informe o preço do produto'
			});
		}
	})
	.transform(
		(values): IProductPayload => ({
			menuCategoryId: values.menuCategoryId,
			name: values.name,
			description: values.description.trim(),
			priceCents: Number(Mask.remove(values.price))
		})
	);

export type ProductFormType = z.input<typeof productSchema>;
export type ProductPayloadType = z.output<typeof productSchema>;
