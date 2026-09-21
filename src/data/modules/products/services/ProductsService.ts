import { api } from 'data/config/api';
import type { IProductPayload } from 'data/modules/products/types/ProductTypes';
import type { IProduct } from 'shared/entities/IProduct';

async function listProducts(restaurantId: string, menuCategoryId: string): Promise<IProduct[]> {
	const { data } = await api.get<IProduct[]>(`/restaurants/${restaurantId}/products`, {
		params: { menuCategoryId }
	});

	return data;
}

async function createProduct(
	restaurantId: string,
	{ description, ...payload }: IProductPayload
): Promise<IProduct> {
	const { data } = await api.post<IProduct>(`/restaurants/${restaurantId}/products`, {
		...payload,
		description: description || undefined
	});

	return data;
}

async function updateProduct(
	restaurantId: string,
	productId: string,
	{ description, ...payload }: IProductPayload
): Promise<IProduct> {
	const { data } = await api.patch<IProduct>(`/restaurants/${restaurantId}/products/${productId}`, {
		...payload,
		description: description || null
	});

	return data;
}

async function setProductAvailability(
	restaurantId: string,
	productId: string,
	isAvailable: boolean
): Promise<IProduct> {
	const { data } = await api.patch<IProduct>(
		`/restaurants/${restaurantId}/products/${productId}/availability`,
		{ isAvailable }
	);

	return data;
}

async function archiveProduct(restaurantId: string, productId: string): Promise<IProduct> {
	const { data } = await api.delete<IProduct>(`/restaurants/${restaurantId}/products/${productId}`);

	return data;
}

export const ProductsService = {
	listProducts,
	createProduct,
	updateProduct,
	setProductAvailability,
	archiveProduct
};
