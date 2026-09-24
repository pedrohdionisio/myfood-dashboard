import type { IMenuCategory } from 'shared/entities/IMenuCategory';
import type { IProduct } from 'shared/entities/IProduct';

export function buildMenuCategory(overrides: Partial<IMenuCategory> = {}): IMenuCategory {
	return {
		id: '5b1f0f5e-7c1a-4c55-9d7e-1a2b3c4d5e6f',
		name: 'Massas',
		position: 0,
		archivedAt: null,
		...overrides
	};
}

export function buildProduct(overrides: Partial<IProduct> = {}): IProduct {
	return {
		id: 'product-1',
		menuCategoryId: '5b1f0f5e-7c1a-4c55-9d7e-1a2b3c4d5e6f',
		name: 'Lasanha',
		description: 'Lasanha à bolonhesa',
		priceCents: 3990,
		imageKey: null,
		imageUrls: null,
		position: 0,
		isAvailable: true,
		archivedAt: null,
		...overrides
	};
}
