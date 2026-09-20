import { OnboardingTemplate } from 'presentation/templates/OnboardingTemplate/OnboardingTemplate';
import { ONBOARDING_STEPS } from 'shared/constants/onboarding';
import { RestaurantOnboardingForm } from './components/RestaurantOnboardingForm/RestaurantOnboardingForm';

export function RestaurantOnboarding() {
	return (
		<OnboardingTemplate
			currentStep={ONBOARDING_STEPS.restaurant}
			title="Cadastre seu restaurante"
			description="Os dados básicos para abrir a loja. Cardápio, horários e taxas você ajusta depois."
		>
			<RestaurantOnboardingForm />
		</OnboardingTemplate>
	);
}
