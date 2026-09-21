import { getApiErrorMessage } from 'data/config/apiError';
import { useActivateRestaurant } from 'data/modules/restaurants/useCases/activateRestaurant/useActivateRestaurant';
import { useActivationChecklist } from 'data/modules/restaurants/useCases/getActivationChecklist/useActivationChecklist';
import toast from 'react-hot-toast';
import type { ActivationRequirement } from 'shared/entities/IActivationChecklist';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import type { IActivationChecklistProps } from './ActivationChecklistTypes';

const REQUIREMENT_DETAILS: Record<
	ActivationRequirement,
	{ label: string; description: string; actionLabel: string; to: string }
> = {
	OPENING_HOURS: {
		label: 'Horários de funcionamento',
		description: 'Cadastre a grade de horários em que a loja recebe pedidos.',
		actionLabel: 'Ir para Configurações',
		to: APP_ROUTES.settings
	},
	AVAILABLE_PRODUCT: {
		label: 'Pelo menos um produto disponível',
		description: 'Um produto no cardápio, marcado como disponível e não arquivado.',
		actionLabel: 'Ir para Produtos',
		to: APP_ROUTES.products
	}
};

export function useActivationChecklistController({ restaurantId }: IActivationChecklistProps) {
	const { activationChecklist, isLoadingActivationChecklist, activationChecklistError } =
		useActivationChecklist(restaurantId);
	const { activateRestaurant, isActivatingRestaurant } = useActivateRestaurant();

	async function handleActivate() {
		try {
			await activateRestaurant(restaurantId);
			toast.success('Restaurante publicado. Sua loja já aparece para os clientes.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		requirements: (activationChecklist?.requirements ?? []).map((requirement) => ({
			code: requirement.code,
			isMet: requirement.isMet,
			...REQUIREMENT_DETAILS[requirement.code]
		})),
		isReadyToActivate: activationChecklist?.isReadyToActivate ?? false,
		isLoadingActivationChecklist,
		activationChecklistErrorMessage: activationChecklistError
			? getApiErrorMessage(activationChecklistError)
			: null,
		isActivatingRestaurant,
		handleActivate
	};
}
