import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useArchiveMenuCategory } from 'data/modules/menuCategories/useCases/archiveMenuCategory/useArchiveMenuCategory';
import { useMenuCategories } from 'data/modules/menuCategories/useCases/listMenuCategories/useMenuCategories';
import { useReorderMenuCategories } from 'data/modules/menuCategories/useCases/reorderMenuCategories/useReorderMenuCategories';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { IMenuCategory } from 'shared/entities/IMenuCategory';
import { sortByIds } from 'shared/utils/sortByIds';

export function useMenuCategoriesController() {
	const { restaurantId } = useSelectedRestaurant();

	const { menuCategories, isLoadingMenuCategories, menuCategoriesError } =
		useMenuCategories(restaurantId);
	const { archiveMenuCategory, isArchivingMenuCategory } = useArchiveMenuCategory();
	const { reorderMenuCategories, isReorderingMenuCategories } = useReorderMenuCategories();

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [editingMenuCategory, setEditingMenuCategory] = useState<IMenuCategory | null>(null);
	const [archivingMenuCategory, setArchivingMenuCategory] = useState<IMenuCategory | null>(null);
	const [isReorderMode, setIsReorderMode] = useState(false);
	const [reorderedMenuCategories, setReorderedMenuCategories] = useState<IMenuCategory[]>([]);

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

	function handleEnterReorderMode() {
		setReorderedMenuCategories(menuCategories);
		setIsReorderMode(true);
	}

	function handleCancelReorder() {
		setIsReorderMode(false);
		setReorderedMenuCategories([]);
	}

	function handleReorder(ids: string[]) {
		setReorderedMenuCategories((current) => sortByIds(current, ids));
	}

	async function handleSaveReorder() {
		if (!restaurantId) {
			return;
		}

		try {
			await reorderMenuCategories({
				restaurantId,
				ids: reorderedMenuCategories.map((menuCategory) => menuCategory.id)
			});
			toast.success('Ordem do cardápio salva.');
			setIsReorderMode(false);
			setReorderedMenuCategories([]);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		restaurantId,
		visibleMenuCategories: isReorderMode ? reorderedMenuCategories : menuCategories,
		reorderIds: reorderedMenuCategories.map((menuCategory) => menuCategory.id),
		isLoadingMenuCategories,
		menuCategoriesErrorMessage: menuCategoriesError
			? getApiErrorMessage(menuCategoriesError)
			: null,
		isEmpty: !isLoadingMenuCategories && !menuCategoriesError && menuCategories.length === 0,
		canReorder: !isLoadingMenuCategories && !menuCategoriesError && menuCategories.length > 1,
		isFormModalOpen,
		editingMenuCategory,
		archivingMenuCategory,
		isArchivingMenuCategory,
		isReorderMode,
		isReorderingMenuCategories,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive,
		handleEnterReorderMode,
		handleCancelReorder,
		handleReorder,
		handleSaveReorder
	};
}
