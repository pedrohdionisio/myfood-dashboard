import type { ILoginResponse } from 'data/modules/auth/types/AuthTypes';
import type { IUser } from 'shared/entities/IUser';

export interface IAuthContextValue {
	user: IUser | null;
	signedIn: boolean;
	signIn: (response: ILoginResponse) => void;
	signOut: () => void;
}
