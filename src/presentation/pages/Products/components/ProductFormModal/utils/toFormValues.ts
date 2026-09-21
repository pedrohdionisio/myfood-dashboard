import type { ProductFormType } from 'data/modules/products/schemas/productSchema';
import type { IProduct } from 'shared/entities/IProduct';
import { Mask } from 'shared/utils/Mask';

export function toFormValues(
	product: IProduct | null,
	defaultMenuCategoryId: string
): ProductFormType {
	if (!product) {
		return {
			menuCategoryId: defaultMenuCategoryId,
			name: '',
			description: '',
			price: '',
			imageKey: null
		};
	}

	return {
		menuCategoryId: product.menuCategoryId,
		name: product.name,
		description: product.description ?? '',
		price: Mask.currency(String(product.priceCents)),
		imageKey: product.imageKey
	};
}
