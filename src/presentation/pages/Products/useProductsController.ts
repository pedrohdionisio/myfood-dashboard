import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMenuCategories } from 'data/modules/menuCategories/useCases/listMenuCategories/useMenuCategories';
import { useArchiveProduct } from 'data/modules/products/useCases/archiveProduct/useArchiveProduct';
import { useProducts } from 'data/modules/products/useCases/listProducts/useProducts';
import { useSetProductAvailability } from 'data/modules/products/useCases/setProductAvailability/useSetProductAvailability';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { IProduct } from 'shared/entities/IProduct';

export function useProductsController() {
	const { selectedRestaurant } = useSelectedRestaurant();
	const restaurantId = selectedRestaurant?.restaurantId ?? null;

	const { menuCategories, isLoadingMenuCategories } = useMenuCategories(restaurantId);

	const [selectedMenuCategoryId, setSelectedMenuCategoryId] = useState<string | null>(null);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
	const [archivingProduct, setArchivingProduct] = useState<IProduct | null>(null);

	const { products, isLoadingProducts, productsError } = useProducts(
		restaurantId,
		selectedMenuCategoryId
	);
	const { setProductAvailability, togglingProductId } = useSetProductAvailability();
	const { archiveProduct, isArchivingProduct } = useArchiveProduct();

	const [firstMenuCategory] = menuCategories;

	useEffect(() => {
		if (!selectedMenuCategoryId && firstMenuCategory) {
			setSelectedMenuCategoryId(firstMenuCategory.id);
		}
	}, [firstMenuCategory, selectedMenuCategoryId]);

	function handleSelectMenuCategory(menuCategoryId: string) {
		setSelectedMenuCategoryId(menuCategoryId);
	}

	function handleOpenCreateModal() {
		setEditingProduct(null);
		setIsFormModalOpen(true);
	}

	function handleOpenEditModal(product: IProduct) {
		setEditingProduct(product);
		setIsFormModalOpen(true);
	}

	function handleCloseFormModal() {
		setIsFormModalOpen(false);
	}

	function handleOpenArchiveModal(product: IProduct) {
		setArchivingProduct(product);
	}

	function handleCloseArchiveModal() {
		setArchivingProduct(null);
	}

	async function handleConfirmArchive() {
		if (!restaurantId || !archivingProduct) {
			return;
		}

		try {
			await archiveProduct({ restaurantId, productId: archivingProduct.id });
			toast.success('Produto arquivado.');
			setArchivingProduct(null);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	async function handleToggleAvailability(product: IProduct) {
		if (!restaurantId) {
			return;
		}

		try {
			await setProductAvailability({
				restaurantId,
				productId: product.id,
				isAvailable: !product.isAvailable
			});
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		restaurantId,
		menuCategories,
		selectedMenuCategoryId,
		hasMenuCategories: !isLoadingMenuCategories && menuCategories.length > 0,
		isLoadingMenuCategories,
		products,
		isLoadingProducts,
		productsErrorMessage: productsError ? getApiErrorMessage(productsError) : null,
		isEmpty: !isLoadingProducts && !productsError && products.length === 0,
		canManageProducts: selectedRestaurant?.role === 'OWNER',
		isFormModalOpen,
		editingProduct,
		archivingProduct,
		isArchivingProduct,
		togglingProductId,
		handleSelectMenuCategory,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive,
		handleToggleAvailability
	};
}
