export const ONBOARDING_STEPS = {
	account: 1,
	restaurant: 2
} as const;

export const ONBOARDING_TOTAL_STEPS = Object.keys(ONBOARDING_STEPS).length;
