import { getApiErrorMessage } from 'data/config/apiError';
import { useSelectedRestaurant } from 'data/contexts/SelectedRestaurantProvider/SelectedRestaurantProvider';
import { useMenuCategories } from 'data/modules/menuCategories/useCases/listMenuCategories/useMenuCategories';
import { useArchiveProduct } from 'data/modules/products/useCases/archiveProduct/useArchiveProduct';
import { useProducts } from 'data/modules/products/useCases/listProducts/useProducts';
import { useReorderProducts } from 'data/modules/products/useCases/reorderProducts/useReorderProducts';
import { useSetProductAvailability } from 'data/modules/products/useCases/setProductAvailability/useSetProductAvailability';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { IProduct } from 'shared/entities/IProduct';
import { sortByIds } from 'shared/utils/sortByIds';

export function useProductsController() {
	const { restaurantId } = useSelectedRestaurant();

	const { menuCategories, isLoadingMenuCategories } = useMenuCategories(restaurantId);

	const [selectedMenuCategoryId, setSelectedMenuCategoryId] = useState<string | null>(null);
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
	const [archivingProduct, setArchivingProduct] = useState<IProduct | null>(null);
	const [isReorderMode, setIsReorderMode] = useState(false);
	const [reorderedProducts, setReorderedProducts] = useState<IProduct[]>([]);

	const { products, isLoadingProducts, productsError } = useProducts(
		restaurantId,
		selectedMenuCategoryId
	);
	const { setProductAvailability, togglingProductId } = useSetProductAvailability();
	const { archiveProduct, isArchivingProduct } = useArchiveProduct();
	const { reorderProducts, isReorderingProducts } = useReorderProducts();

	const [firstMenuCategory] = menuCategories;

	useEffect(() => {
		if (!selectedMenuCategoryId && firstMenuCategory) {
			setSelectedMenuCategoryId(firstMenuCategory.id);
		}
	}, [firstMenuCategory, selectedMenuCategoryId]);

	function handleSelectMenuCategory(menuCategoryId: string) {
		setSelectedMenuCategoryId(menuCategoryId);
		setIsReorderMode(false);
		setReorderedProducts([]);
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

	function handleEnterReorderMode() {
		setReorderedProducts(products);
		setIsReorderMode(true);
	}

	function handleCancelReorder() {
		setIsReorderMode(false);
		setReorderedProducts([]);
	}

	function handleReorder(ids: string[]) {
		setReorderedProducts((current) => sortByIds(current, ids));
	}

	async function handleSaveReorder() {
		if (!restaurantId || !selectedMenuCategoryId) {
			return;
		}

		try {
			await reorderProducts({
				restaurantId,
				menuCategoryId: selectedMenuCategoryId,
				ids: reorderedProducts.map((product) => product.id)
			});
			toast.success('Ordem dos produtos salva.');
			setIsReorderMode(false);
			setReorderedProducts([]);
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
		visibleProducts: isReorderMode ? reorderedProducts : products,
		reorderIds: reorderedProducts.map((product) => product.id),
		isLoadingProducts,
		productsErrorMessage: productsError ? getApiErrorMessage(productsError) : null,
		isEmpty: !isLoadingProducts && !productsError && products.length === 0,
		canReorder: !isLoadingProducts && !productsError && products.length > 1,
		isFormModalOpen,
		editingProduct,
		archivingProduct,
		isArchivingProduct,
		togglingProductId,
		isReorderMode,
		isReorderingProducts,
		handleSelectMenuCategory,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive,
		handleToggleAvailability,
		handleEnterReorderMode,
		handleCancelReorder,
		handleReorder,
		handleSaveReorder
	};
}
