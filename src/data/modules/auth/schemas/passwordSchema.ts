import { z } from 'zod';

export const passwordSchema = z
	.string()
	.min(8, 'A senha deve ter no mínimo 8 caracteres')
	.max(128, 'A senha deve ter no máximo 128 caracteres')
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
		'A senha precisa de letra maiúscula, letra minúscula e número'
	);
