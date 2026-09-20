import { StepIndicator } from 'presentation/components/StepIndicator/StepIndicator';
import logo from 'shared/assets/black-red-logo.svg';
import { ONBOARDING_TOTAL_STEPS } from 'shared/constants/onboarding';
import type { IOnboardingTemplateProps } from './OnboardingTemplateTypes';

export function OnboardingTemplate({
	currentStep,
	title,
	description,
	children
}: IOnboardingTemplateProps) {
	return (
		<main className="flex min-h-svh justify-center bg-background px-4 py-12">
			<div className="flex w-full max-w-xl flex-col">
				<header className="flex flex-col items-center gap-8">
					<img src={logo} alt="MyFood" className="h-10 w-auto" />

					<StepIndicator currentStep={currentStep} totalSteps={ONBOARDING_TOTAL_STEPS} />

					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-title-md">{title}</h1>

						<p className="text-body-sm text-muted-foreground">{description}</p>
					</div>
				</header>

				{children}
			</div>
		</main>
	);
}
