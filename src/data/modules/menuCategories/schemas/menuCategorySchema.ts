import { z } from 'zod';

export const menuCategorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'O nome deve ter ao menos 2 caracteres')
		.max(80, 'O nome deve ter no máximo 80 caracteres')
});

export type MenuCategoryFormType = z.infer<typeof menuCategorySchema>;
