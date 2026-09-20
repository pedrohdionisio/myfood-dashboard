import type { ComponentProps } from 'react';

export interface IStepIndicatorProps extends Omit<ComponentProps<'ol'>, 'children'> {
	currentStep: number;
	totalSteps: number;
}
