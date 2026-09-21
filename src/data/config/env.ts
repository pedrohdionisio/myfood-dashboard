const apiUrl: string | undefined = import.meta.env.VITE_API_URL;

if (!apiUrl) {
	throw new Error(
		'VITE_API_URL não configurada. Copie o .env.example para .env e preencha a URL da myfood-api.'
	);
}

export const env = {
	apiUrl
};
