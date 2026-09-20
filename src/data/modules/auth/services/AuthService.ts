import { api, publicApi } from 'data/config/api';
import type {
	ILoginPayload,
	ILoginResponse,
	IRefreshTokenPayload,
	IRefreshTokenResponse
} from 'data/modules/auth/types/AuthTypes';
import type { IUser } from 'shared/entities/IUser';

async function login(payload: ILoginPayload): Promise<ILoginResponse> {
	const { data } = await publicApi.post<ILoginResponse>('/auth/restaurant-users/sign-in', payload);

	return data;
}

async function refreshToken(payload: IRefreshTokenPayload): Promise<IRefreshTokenResponse> {
	const { data } = await publicApi.post<IRefreshTokenResponse>(
		'/auth/restaurant-users/refresh',
		payload
	);

	return data;
}

async function getMe(): Promise<IUser> {
	const { data } = await api.get<IUser>('/restaurant-users/me');

	return data;
}

export const AuthService = {
	login,
	refreshToken,
	getMe
};
