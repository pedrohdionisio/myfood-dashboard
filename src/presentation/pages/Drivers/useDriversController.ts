import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import type { IUpdateMemberPayload } from 'data/modules/members/types/MemberTypes';
import { useMembers } from 'data/modules/members/useCases/listMembers/useMembers';
import { useUpdateMember } from 'data/modules/members/useCases/updateMember/useUpdateMember';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';
import type { ConfirmableDriverAction, IPendingDriverAction } from './DriversTypes';
import { toDriverActionCopy } from './utils/toDriverActionCopy';

const PAYLOAD_BY_ACTION: Record<ConfirmableDriverAction, IUpdateMemberPayload> = {
	DEACTIVATE: { active: false },
	PROMOTE: { role: 'OWNER' }
};

const SUCCESS_MESSAGE_BY_ACTION: Record<ConfirmableDriverAction, string> = {
	DEACTIVATE: 'Entregador desativado.',
	PROMOTE: 'Agora essa pessoa é dona do restaurante.'
};

export function useDriversController() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const { members, isLoadingMembers, membersError } = useMembers(restaurantId);
	const { updateMember, isUpdatingMember } = useUpdateMember();

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [pendingAction, setPendingAction] = useState<IPendingDriverAction | null>(null);
	const [activatingDriverId, setActivatingDriverId] = useState<string | null>(null);

	const drivers = members.filter((member) => member.role === 'DRIVER');

	function handleOpenCreateModal() {
		setIsFormModalOpen(true);
	}

	function handleCloseFormModal() {
		setIsFormModalOpen(false);
	}

	function handleRequestAction(driver: IRestaurantMember, action: ConfirmableDriverAction) {
		setPendingAction({ driver, action });
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
				memberId: pendingAction.driver.id,
				...PAYLOAD_BY_ACTION[pendingAction.action]
			});

			toast.success(SUCCESS_MESSAGE_BY_ACTION[pendingAction.action]);
			setPendingAction(null);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	async function handleActivate(driver: IRestaurantMember) {
		if (!restaurantId) {
			return;
		}

		setActivatingDriverId(driver.id);

		try {
			await updateMember({ restaurantId, memberId: driver.id, active: true });

			toast.success('Entregador reativado.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setActivatingDriverId(null);
		}
	}

	return {
		restaurantId,
		drivers,
		isLoadingDrivers: isLoadingMembers,
		driversErrorMessage: membersError ? getApiErrorMessage(membersError) : null,
		isEmpty: !isLoadingMembers && !membersError && drivers.length === 0,
		isFormModalOpen,
		pendingActionCopy: pendingAction ? toDriverActionCopy(pendingAction) : null,
		isConfirmingAction: isUpdatingMember && !!pendingAction,
		activatingDriverId,
		handleOpenCreateModal,
		handleCloseFormModal,
		handleRequestAction,
		handleCloseActionModal,
		handleConfirmAction,
		handleActivate
	};
}
