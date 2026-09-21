import type { IMenuCategory } from 'shared/entities/IMenuCategory';
import type { IProduct } from 'shared/entities/IProduct';

export interface IProductFormModalProps {
	isOpen: boolean;
	restaurantId: string;
	menuCategories: IMenuCategory[];
	defaultMenuCategoryId: string;
	product: IProduct | null;
	onClose: () => void;
}
