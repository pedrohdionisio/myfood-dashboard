import type { IUser } from 'shared/entities/IUser';

export function buildUser(overrides: Partial<IUser> = {}): IUser {
	return {
		id: 'user-1',
		name: 'Pedro',
		email: 'pedro@myfood.com',
		...overrides
	};
}
