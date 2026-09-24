import { z } from 'zod';

const optionalString = z
	.string()
	.optional()
	.transform((value) => value?.trim() || undefined);

const envSchema = z.object({
	VITE_API_URL: z.url(),
	VITE_SENTRY_DSN: optionalString.pipe(z.url().optional()),
	VITE_CLARITY_PROJECT_ID: optionalString
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
	const invalidVariables = result.error.issues.map((issue) => issue.path.join('.')).join(', ');

	throw new Error(
		`Invalid environment variables: ${invalidVariables}. Copy .env.example to .env and fill them in.`
	);
}

export const env = {
	apiUrl: result.data.VITE_API_URL,
	sentryDsn: result.data.VITE_SENTRY_DSN,
	clarityProjectId: result.data.VITE_CLARITY_PROJECT_ID,
	mode: import.meta.env.MODE
};
