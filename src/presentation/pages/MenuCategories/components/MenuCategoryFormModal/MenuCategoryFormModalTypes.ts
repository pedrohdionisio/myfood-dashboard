import type { IMenuCategory } from 'shared/entities/IMenuCategory';

export interface IMenuCategoryFormModalProps {
	isOpen: boolean;
	restaurantId: string;
	menuCategory: IMenuCategory | null;
	onClose: () => void;
}
