const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

if (!apiUrl) {
	throw new Error(
		'VITE_API_URL is not set. Copy .env.example to .env and fill in the myfood-api URL.'
	);
}

export const env = {
	apiUrl
};
