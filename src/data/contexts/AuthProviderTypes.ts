import type { IAuthSessionResponse } from 'data/modules/auth/types/AuthTypes';
import type { IUser } from 'shared/entities/IUser';

export interface IAuthContextValue {
	user: IUser | null;
	signedIn: boolean;
	signIn: (response: IAuthSessionResponse) => void;
	signOut: () => void;
}
