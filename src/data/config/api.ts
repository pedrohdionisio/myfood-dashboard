import axios, { type AxiosInstance, type InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { sleep } from 'shared/utils/sleep';
import { env } from './env';

export const api = axios.create({
	baseURL: env.apiUrl
});

export const publicApi = axios.create({
	baseURL: env.apiUrl
});

function delayRequests(instance: AxiosInstance) {
	instance.interceptors.request.use(async (config) => {
		await sleep(500);

		return config;
	});
}

if (import.meta.env.DEV && 500 > 0) {
	delayRequests(api);
	delayRequests(publicApi);
}

interface IRetriableRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

export interface ISessionHandlers {
	refreshAccessToken: () => Promise<void>;
	signOut: () => void;
}

let sessionInterceptorId: number | undefined;
let sessionHandlers: ISessionHandlers | null = null;
let refreshPromise: Promise<void> | null = null;

export function setAccessToken(accessToken: string) {
	api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function removeAccessToken() {
	api.defaults.headers.common.Authorization = undefined;
}

export function getAuthorizationHeader(): string | null {
	const authorization = api.defaults.headers.common.Authorization;

	return typeof authorization === 'string' ? authorization : null;
}

export function renewAccessToken(): Promise<void> {
	if (!sessionHandlers) {
		return Promise.reject(new Error('Não há sessão ativa para renovar'));
	}

	if (!refreshPromise) {
		refreshPromise = sessionHandlers.refreshAccessToken().finally(() => {
			refreshPromise = null;
		});
	}

	return refreshPromise;
}

export function removeSessionHandlers() {
	if (sessionInterceptorId !== undefined) {
		api.interceptors.response.eject(sessionInterceptorId);
		sessionInterceptorId = undefined;
	}

	sessionHandlers = null;
	refreshPromise = null;
}

export function setSessionHandlers(handlers: ISessionHandlers) {
	removeSessionHandlers();

	sessionHandlers = handlers;

	sessionInterceptorId = api.interceptors.response.use(
		(response) => response,
		async (error: unknown) => {
			if (!isAxiosError(error) || error.response?.status !== 401) {
				return Promise.reject(error);
			}

			const config = error.config as IRetriableRequestConfig | undefined;

			if (!config) {
				return Promise.reject(error);
			}

			if (config._retry) {
				handlers.signOut();

				return Promise.reject(error);
			}

			config._retry = true;

			await renewAccessToken();

			const authorization = getAuthorizationHeader();

			if (authorization) {
				config.headers.Authorization = authorization;
			}

			return api(config);
		}
	);
}
