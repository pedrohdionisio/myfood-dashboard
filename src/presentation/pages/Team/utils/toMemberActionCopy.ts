import type { IMemberActionCopy, IPendingMemberAction } from '../TeamTypes';

export function toMemberActionCopy({ member, action }: IPendingMemberAction): IMemberActionCopy {
	if (action === 'PROMOTE') {
		return {
			title: 'Tornar dono',
			description: `${member.name} passa a ter acesso total ao painel: cardápio, pedidos, equipe e configurações. Também passa a poder alterar o acesso de toda a equipe, inclusive o seu, e deixa de receber despachos.`,
			confirmLabel: 'Tornar dono'
		};
	}

	if (action === 'DEMOTE') {
		return {
			title: 'Tornar entregador',
			description: `${member.name} perde o acesso ao painel na hora e passa a receber despachos. As entregas ficam no app MyFood, com o mesmo e-mail e senha.`,
			confirmLabel: 'Tornar entregador'
		};
	}

	return {
		title: 'Desativar acesso',
		description:
			member.role === 'DRIVER'
				? `${member.name} perde o acesso às entregas deste restaurante na hora. Se houver uma entrega em rota com essa pessoa, encerre-a pelo pedido como entrega frustrada.`
				: `${member.name} perde o acesso ao painel deste restaurante na hora.`,
		confirmLabel: 'Desativar'
	};
}
