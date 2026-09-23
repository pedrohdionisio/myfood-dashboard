import type { IUser } from 'shared/entities/IUser';

export interface ILoginPayload {
	email: string;
	password: string;
}

export interface ISignUpPayload {
	name: string;
	email: string;
	password: string;
	phone?: string;
}

export interface IAuthSession {
	accessToken: string;
	idToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface IAuthSessionResponse {
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

export interface IForgotPasswordPayload {
	email: string;
}

export interface IResetPasswordPayload {
	email: string;
	code: string;
	password: string;
}

export interface IPasswordRecoveryResponse {
	message: string;
}
