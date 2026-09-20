import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email('Formato de e-mail inválido').max(254),
	password: z.string().min(1, 'Informe sua senha').max(128)
});

export type LoginFormType = z.infer<typeof loginSchema>;
