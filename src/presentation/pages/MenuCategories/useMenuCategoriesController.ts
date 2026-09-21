import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useArchiveMenuCategory } from 'data/modules/menuCategories/useCases/archiveMenuCategory/useArchiveMenuCategory';
import { useMenuCategories } from 'data/modules/menuCategories/useCases/listMenuCategories/useMenuCategories';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { IMenuCategory } from 'shared/entities/IMenuCategory';

export function useMenuCategoriesController() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const { menuCategories, isLoadingMenuCategories, menuCategoriesError } =
		useMenuCategories(restaurantId);
	const { archiveMenuCategory, isArchivingMenuCategory } = useArchiveMenuCategory();

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [editingMenuCategory, setEditingMenuCategory] = useState<IMenuCategory | null>(null);
	const [archivingMenuCategory, setArchivingMenuCategory] = useState<IMenuCategory | null>(null);

	function handleOpenCreateModal() {
		setEditingMenuCategory(null);
		setIsFormModalOpen(true);
	}

	function handleOpenEditModal(menuCategory: IMenuCategory) {
		setEditingMenuCategory(menuCategory);
		setIsFormModalOpen(true);
	}

	function handleCloseFormModal() {
		setIsFormModalOpen(false);
	}

	function handleOpenArchiveModal(menuCategory: IMenuCategory) {
		setArchivingMenuCategory(menuCategory);
	}

	function handleCloseArchiveModal() {
		setArchivingMenuCategory(null);
	}

	async function handleConfirmArchive() {
		if (!restaurantId || !archivingMenuCategory) {
			return;
		}

		try {
			await archiveMenuCategory({ restaurantId, menuCategoryId: archivingMenuCategory.id });
			toast.success('Categoria arquivada.');
			setArchivingMenuCategory(null);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		restaurantId,
		menuCategories,
		isLoadingMenuCategories,
		menuCategoriesErrorMessage: menuCategoriesError
			? getApiErrorMessage(menuCategoriesError)
			: null,
		isEmpty: !isLoadingMenuCategories && !menuCategoriesError && menuCategories.length === 0,
		canManageMenuCategories: selectedRestaurant?.role === 'OWNER',
		isFormModalOpen,
		editingMenuCategory,
		archivingMenuCategory,
		isArchivingMenuCategory,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive
	};
}
