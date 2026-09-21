import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import { Switch } from 'presentation/components/Switch/Switch';
import type { IAcceptingOrdersCardProps } from './AcceptingOrdersCardTypes';
import { useAcceptingOrdersCardController } from './useAcceptingOrdersCardController';

export function AcceptingOrdersCard({ restaurant }: IAcceptingOrdersCardProps) {
	const { isAcceptingOrders, isPublished, isSettingAcceptingOrders, handleToggleAcceptingOrders } =
		useAcceptingOrdersCardController({ restaurant });

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recebimento de pedidos</CardTitle>

				<CardDescription>
					{isAcceptingOrders
						? 'A loja está recebendo pedidos normalmente. Pause quando a cozinha não der conta.'
						: 'A loja está pausada: ela continua visível, mas não aceita pedidos novos.'}

					{isPublished ? null : ' Só passa a valer depois que o restaurante for publicado.'}
				</CardDescription>

				<CardAction>
					<Switch
						checked={isAcceptingOrders}
						disabled={isSettingAcceptingOrders}
						aria-label="Receber pedidos"
						onCheckedChange={handleToggleAcceptingOrders}
					/>
				</CardAction>
			</CardHeader>
		</Card>
	);
}
