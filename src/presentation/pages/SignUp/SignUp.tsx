import { OnboardingTemplate } from 'presentation/templates/OnboardingTemplate/OnboardingTemplate';
import { ONBOARDING_STEPS } from 'shared/constants/onboarding';
import { SignUpForm } from './components/SignUpForm/SignUpForm';

export function SignUp() {
	return (
		<OnboardingTemplate
			currentStep={ONBOARDING_STEPS.account}
			title="Crie sua conta"
			description="Estes são seus dados de acesso ao painel. No próximo passo você cadastra o restaurante."
		>
			<SignUpForm />
		</OnboardingTemplate>
	);
}
