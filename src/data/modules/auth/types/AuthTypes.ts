import type { IUser } from 'shared/entities/IUser';

export interface ILoginPayload {
	email: string;
	password: string;
}

export interface IAuthSession {
	accessToken: string;
	idToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface ILoginResponse {
	user: IUser;
	session: IAuthSession;
}

export interface IRefreshTokenPayload {
	refreshToken: string;
}

export interface IRefreshTokenResponse {
	accessToken: string;
	idToken: string;
	expiresIn: number;
}
