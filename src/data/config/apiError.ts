import { isAxiosError } from 'axios';

export const API_ERROR_CODES = [
	'BAD_REQUEST',
	'VALIDATION_ERROR',
	'DOMAIN_ERROR',
	'UNAUTHORIZED',
	'FORBIDDEN',
	'NOT_FOUND',
	'CONFLICT',
	'TOO_MANY_REQUESTS',
	'INTERNAL_ERROR'
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

const NETWORK_ERROR_MESSAGE = 'Não foi possível falar com o servidor. Verifique sua conexão.';
const FALLBACK_MESSAGE = 'Não foi possível concluir a ação. Tente novamente.';

interface IApiErrorBody {
	code?: string;
	message?: string;
	requestId?: string;
}

function isApiErrorCode(code: string): code is ApiErrorCode {
	return API_ERROR_CODES.includes(code as ApiErrorCode);
}

export function getApiErrorCode(error: unknown): ApiErrorCode | null {
	if (!isAxiosError<IApiErrorBody>(error)) {
		return null;
	}

	const code = error.response?.data?.code;

	if (!code || !isApiErrorCode(code)) {
		return null;
	}

	return code;
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
