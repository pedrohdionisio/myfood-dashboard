import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';

export type ConfirmableDriverAction = 'DEACTIVATE' | 'PROMOTE';

export interface IPendingDriverAction {
	driver: IRestaurantMember;
	action: ConfirmableDriverAction;
}

export interface IDriverActionCopy {
	title: string;
	description: string;
	confirmLabel: string;
}
