import { isAxiosError } from 'axios';

const NETWORK_ERROR_MESSAGE = 'Não foi possível falar com o servidor. Verifique sua conexão.';
const FALLBACK_MESSAGE = 'Não foi possível concluir a ação. Tente novamente.';

interface IApiErrorBody {
	message?: string;
}

export function getApiErrorMessage(error: unknown): string {
	if (!isAxiosError<IApiErrorBody>(error)) {
		return FALLBACK_MESSAGE;
	}

	if (!error.response) {
		return NETWORK_ERROR_MESSAGE;
	}

	return error.response.data?.message ?? FALLBACK_MESSAGE;
}
