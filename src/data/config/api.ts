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
		await sleep(env.requestDelayMs);

		return config;
	});
}

if (import.meta.env.DEV && env.requestDelayMs > 0) {
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
let refreshPromise: Promise<void> | null = null;

export function setAccessToken(accessToken: string) {
	api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function removeAccessToken() {
	api.defaults.headers.common.Authorization = undefined;
}

export function removeSessionHandlers() {
	if (sessionInterceptorId !== undefined) {
		api.interceptors.response.eject(sessionInterceptorId);
		sessionInterceptorId = undefined;
	}

	refreshPromise = null;
}

export function setSessionHandlers({ refreshAccessToken, signOut }: ISessionHandlers) {
	removeSessionHandlers();

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
				signOut();

				return Promise.reject(error);
			}

			config._retry = true;

			if (!refreshPromise) {
				refreshPromise = refreshAccessToken().finally(() => {
					refreshPromise = null;
				});
			}

			await refreshPromise;

			const authorization = api.defaults.headers.common.Authorization;

			if (authorization) {
				config.headers.Authorization = authorization;
			}

			return api(config);
		}
	);
}
