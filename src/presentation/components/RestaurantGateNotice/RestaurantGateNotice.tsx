import { OctagonAlertIcon } from 'lucide-react';
import { ActivationChecklist } from 'presentation/components/ActivationChecklist/ActivationChecklist';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import type { IRestaurantGateNoticeProps } from './RestaurantGateNoticeTypes';

export function RestaurantGateNotice({ gate, restaurantId }: IRestaurantGateNoticeProps) {
	if (gate === 'MUST_ACTIVATE') {
		return <ActivationChecklist restaurantId={restaurantId} />;
	}

	if (gate === 'SUSPENDED') {
		return (
			<Alert variant="destructive">
				<OctagonAlertIcon aria-hidden="true" />

				<AlertTitle>Este restaurante está suspenso</AlertTitle>

				<AlertDescription>
					Enquanto a suspensão durar, a loja não aparece para os clientes e o painel não carrega.
					Fale com o suporte da plataforma para resolver.
				</AlertDescription>
			</Alert>
		);
	}

	return null;
}
