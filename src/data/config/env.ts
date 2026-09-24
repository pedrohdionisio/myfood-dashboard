import { z } from 'zod';

const envSchema = z.object({
	VITE_API_URL: z.url()
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
	const invalidVariables = result.error.issues.map((issue) => issue.path.join('.')).join(', ');

	throw new Error(
		`Invalid environment variables: ${invalidVariables}. Copy .env.example to .env and fill them in.`
	);
}

export const env = {
	apiUrl: result.data.VITE_API_URL
};
