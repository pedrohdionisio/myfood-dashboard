import { z } from 'zod';

export const replySchema = z.object({
	reply: z
		.string()
		.trim()
		.min(3, 'A resposta deve ter ao menos 3 caracteres')
		.max(1000, 'A resposta deve ter no máximo 1000 caracteres')
});

export type ReplyFormType = z.infer<typeof replySchema>;
