import { getApiErrorMessage } from 'data/config/apiError';
import { useAuth } from 'data/contexts/AuthProvider/AuthProvider';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import type { IUpdateMemberPayload } from 'data/modules/members/types/MemberTypes';
import { useMembers } from 'data/modules/members/useCases/listMembers/useMembers';
import { useUpdateMember } from 'data/modules/members/useCases/updateMember/useUpdateMember';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';
import type { ConfirmableMemberAction, IPendingMemberAction, ITeamRow } from './TeamTypes';
import { toMemberActionCopy } from './utils/toMemberActionCopy';

const PAYLOAD_BY_ACTION: Record<ConfirmableMemberAction, IUpdateMemberPayload> = {
	DEACTIVATE: { active: false },
	PROMOTE: { role: 'OWNER' },
	DEMOTE: { role: 'DRIVER' }
};

const SUCCESS_MESSAGE_BY_ACTION: Record<ConfirmableMemberAction, string> = {
	DEACTIVATE: 'Acesso desativado.',
	PROMOTE: 'Agora essa pessoa é dona do restaurante.',
	DEMOTE: 'Agora essa pessoa é entregadora.'
};

export function useTeamController() {
	const { user } = useAuth();
	const { restaurantId } = useSelectedRestaurant();

	const { members, isLoadingMembers, membersError } = useMembers(restaurantId);
	const { updateMember, isUpdatingMember } = useUpdateMember();

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [pendingAction, setPendingAction] = useState<IPendingMemberAction | null>(null);
	const [activatingMemberId, setActivatingMemberId] = useState<string | null>(null);

	const rows: ITeamRow[] = members.map((member) => ({
		member,
		isSelf: member.userId === user?.id
	}));

	function handleOpenCreateModal() {
		setIsFormModalOpen(true);
	}

	function handleCloseFormModal() {
		setIsFormModalOpen(false);
	}

	function handleRequestAction(member: IRestaurantMember, action: ConfirmableMemberAction) {
		setPendingAction({ member, action });
	}

	function handleCloseActionModal() {
		setPendingAction(null);
	}

	async function handleConfirmAction() {
		if (!restaurantId || !pendingAction) {
			return;
		}

		try {
			await updateMember({
				restaurantId,
				memberId: pendingAction.member.id,
				...PAYLOAD_BY_ACTION[pendingAction.action]
			});

			toast.success(SUCCESS_MESSAGE_BY_ACTION[pendingAction.action]);
			setPendingAction(null);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	async function handleActivate(member: IRestaurantMember) {
		if (!restaurantId) {
			return;
		}

		setActivatingMemberId(member.id);

		try {
			await updateMember({ restaurantId, memberId: member.id, active: true });

			toast.success('Acesso reativado.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setActivatingMemberId(null);
		}
	}

	return {
		restaurantId,
		rows,
		isLoadingMembers,
		membersErrorMessage: membersError ? getApiErrorMessage(membersError) : null,
		isEmpty: !isLoadingMembers && !membersError && members.length === 0,
		isFormModalOpen,
		pendingActionCopy: pendingAction ? toMemberActionCopy(pendingAction) : null,
		isConfirmingAction: isUpdatingMember && !!pendingAction,
		activatingMemberId,
		handleOpenCreateModal,
		handleCloseFormModal,
		handleRequestAction,
		handleCloseActionModal,
		handleConfirmAction,
		handleActivate
	};
}
