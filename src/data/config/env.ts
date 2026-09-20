const apiUrl: string | undefined = import.meta.env.VITE_API_URL;
const configuredDelayMs = Number(import.meta.env.VITE_REQUEST_DELAY_MS);
const requestDelayMs = Number.isFinite(configuredDelayMs) ? configuredDelayMs : 0;

if (!apiUrl) {
	throw new Error(
		'VITE_API_URL não configurada. Copie o .env.example para .env e preencha a URL da myfood-api.'
	);
}

export const env = {
	apiUrl,
	requestDelayMs: import.meta.env.DEV ? requestDelayMs : 0
};
