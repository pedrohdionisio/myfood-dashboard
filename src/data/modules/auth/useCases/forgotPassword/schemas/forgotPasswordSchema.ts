import { z } from 'zod';

export const forgotPasswordSchema = z.object({
	email: z.email('Formato de e-mail inválido').max(254, 'O e-mail é muito longo')
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
