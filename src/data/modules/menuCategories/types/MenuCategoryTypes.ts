export interface IMenuCategoryPayload {
	name: string;
}

export interface ICreateMenuCategoryVariables extends IMenuCategoryPayload {
	restaurantId: string;
}

export interface IUpdateMenuCategoryVariables extends IMenuCategoryPayload {
	restaurantId: string;
	menuCategoryId: string;
}

export interface IArchiveMenuCategoryVariables {
	restaurantId: string;
	menuCategoryId: string;
}

export interface IReorderMenuCategoriesPayload {
	ids: string[];
}

export interface IReorderMenuCategoriesVariables extends IReorderMenuCategoriesPayload {
	restaurantId: string;
}
