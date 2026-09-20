import { cn } from 'cn';
import type { IStepIndicatorProps } from './StepIndicatorTypes';

export function StepIndicator({
	currentStep,
	totalSteps,
	className,
	...props
}: IStepIndicatorProps) {
	const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

	return (
		<ol
			data-slot="step-indicator"
			aria-label={`Passo ${currentStep} de ${totalSteps}`}
			className={cn('flex w-full items-center gap-3', className)}
			{...props}
		>
			{steps.map((step) => (
				<li
					key={step}
					aria-current={step === currentStep ? 'step' : undefined}
					className={cn(
						'h-1.5 flex-1 rounded-full transition-colors',
						step <= currentStep ? 'bg-linear-to-r from-brand-strong to-brand' : 'bg-muted'
					)}
				/>
			))}
		</ol>
	);
}
