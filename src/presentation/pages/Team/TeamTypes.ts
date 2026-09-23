import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';

export type ConfirmableMemberAction = 'DEACTIVATE' | 'PROMOTE' | 'DEMOTE';

export interface IPendingMemberAction {
	member: IRestaurantMember;
	action: ConfirmableMemberAction;
}

export interface IMemberActionCopy {
	title: string;
	description: string;
	confirmLabel: string;
}

export interface ITeamRow {
	member: IRestaurantMember;
	isSelf: boolean;
}
