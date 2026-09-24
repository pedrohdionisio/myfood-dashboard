import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { getApiErrorMessage } from './apiError';

function responseError(data: unknown) {
	const config = { headers: new AxiosHeaders() };

	return new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, {
		data,
		status: 409,
		statusText: 'Conflict',
		headers: {},
		config
	});
}

describe('getApiErrorMessage', () => {
	it('returns the message sent by the api', () => {
		expect(getApiErrorMessage(responseError({ message: 'CNPJ já cadastrado' }))).toBe(
			'CNPJ já cadastrado'
		);
	});

	it('falls back when the api sends no message', () => {
		expect(getApiErrorMessage(responseError({}))).toBe(
			'Não foi possível concluir a ação. Tente novamente.'
		);
	});

	it('explains network failures', () => {
		expect(getApiErrorMessage(new AxiosError('Network Error', 'ERR_NETWORK'))).toBe(
			'Não foi possível falar com o servidor. Verifique sua conexão.'
		);
	});

	it('falls back for errors outside axios', () => {
		expect(getApiErrorMessage(new Error('boom'))).toBe(
			'Não foi possível concluir a ação. Tente novamente.'
		);
	});
});
