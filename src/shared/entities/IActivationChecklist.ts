export const ACTIVATION_REQUIREMENTS = ['OPENING_HOURS', 'AVAILABLE_PRODUCT'] as const;

export type ActivationRequirement = (typeof ACTIVATION_REQUIREMENTS)[number];

export interface IActivationRequirementState {
	code: ActivationRequirement;
	isMet: boolean;
}

export interface IActivationChecklist {
	isReadyToActivate: boolean;
	requirements: IActivationRequirementState[];
}
