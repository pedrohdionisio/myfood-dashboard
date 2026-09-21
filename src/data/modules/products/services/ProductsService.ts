import { api } from 'data/config/api';
import type {
	IProductPayload,
	IReorderProductsPayload
} from 'data/modules/products/types/ProductTypes';
import type { IProduct } from 'shared/entities/IProduct';

async function list(restaurantId: string, menuCategoryId: string): Promise<IProduct[]> {
	const { data } = await api.get<IProduct[]>(`/restaurants/${restaurantId}/products`, {
		params: { menuCategoryId }
	});

	return data;
}

async function create(
	restaurantId: string,
	{ description, imageKey, ...payload }: IProductPayload
): Promise<IProduct> {
	const { data } = await api.post<IProduct>(`/restaurants/${restaurantId}/products`, {
		...payload,
		description: description || undefined,
		imageKey: imageKey ?? undefined
	});

	return data;
}

async function update(
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

async function setAvailability(
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

async function archive(restaurantId: string, productId: string): Promise<IProduct> {
	const { data } = await api.delete<IProduct>(`/restaurants/${restaurantId}/products/${productId}`);

	return data;
}

async function reorder(
	restaurantId: string,
	payload: IReorderProductsPayload
): Promise<IProduct[]> {
	const { data } = await api.patch<IProduct[]>(
		`/restaurants/${restaurantId}/products/reorder`,
		payload
	);

	return data;
}

export const ProductsService = {
	list,
	create,
	update,
	setAvailability,
	archive,
	reorder
};
