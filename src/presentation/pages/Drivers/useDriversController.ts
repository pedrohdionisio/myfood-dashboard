import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMembers } from 'data/modules/members/useCases/listMembers/useMembers';
import { useState } from 'react';

export function useDriversController() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const { members, isLoadingMembers, membersError } = useMembers(restaurantId);

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);

	const drivers = members.filter((member) => member.role === 'DRIVER');

	function handleOpenCreateModal() {
		setIsFormModalOpen(true);
	}

	function handleCloseFormModal() {
		setIsFormModalOpen(false);
	}

	return {
		restaurantId,
		drivers,
		isLoadingDrivers: isLoadingMembers,
		driversErrorMessage: membersError ? getApiErrorMessage(membersError) : null,
		isEmpty: !isLoadingMembers && !membersError && drivers.length === 0,
		isFormModalOpen,
		handleOpenCreateModal,
		handleCloseFormModal
	};
}
