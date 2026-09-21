import type { IMenuCategory } from 'shared/entities/IMenuCategory';

export function sortMenuCategoriesByIds(
	menuCategories: IMenuCategory[],
	ids: string[]
): IMenuCategory[] {
	return ids
		.map((id) => menuCategories.find((menuCategory) => menuCategory.id === id))
		.filter((menuCategory) => menuCategory !== undefined);
}
