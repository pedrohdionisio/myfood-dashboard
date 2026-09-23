import type { IDriverActionCopy, IPendingDriverAction } from '../DriversTypes';

export function toDriverActionCopy({ driver, action }: IPendingDriverAction): IDriverActionCopy {
	if (action === 'PROMOTE') {
		return {
			title: 'Tornar dono',
			description: `${driver.name} passa a ter acesso total ao painel: cardápio, pedidos, equipe e configurações. Também passa a poder alterar o acesso de toda a equipe, inclusive o seu. Sai da lista de entregadores e deixa de receber despachos.`,
			confirmLabel: 'Tornar dono'
		};
	}

	return {
		title: 'Desativar entregador',
		description: `${driver.name} perde o acesso às entregas deste restaurante na hora. Se houver uma entrega em rota com essa pessoa, encerre-a pelo pedido como entrega frustrada.`,
		confirmLabel: 'Desativar'
	};
}
