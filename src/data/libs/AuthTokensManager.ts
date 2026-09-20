import { AUTH_TOKENS_STORAGE_KEY } from 'shared/constants/storage';

export interface IAuthTokens {
	accessToken: string;
	refreshToken: string;
}

function isAuthTokens(value: unknown): value is IAuthTokens {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const { accessToken, refreshToken } = value as Partial<IAuthTokens>;

	return typeof accessToken === 'string' && typeof refreshToken === 'string';
}

function save(tokens: IAuthTokens) {
	localStorage.setItem(AUTH_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

function load(): IAuthTokens | null {
	const stored = localStorage.getItem(AUTH_TOKENS_STORAGE_KEY);

	if (!stored) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(stored);

		return isAuthTokens(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function clear() {
	localStorage.removeItem(AUTH_TOKENS_STORAGE_KEY);
}

export const AuthTokensManager = {
	save,
	load,
	clear
};
