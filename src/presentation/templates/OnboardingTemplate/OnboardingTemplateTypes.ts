import type { PropsWithChildren } from 'react';

export interface IOnboardingTemplateProps extends PropsWithChildren {
	currentStep: number;
	title: string;
	description: string;
}
