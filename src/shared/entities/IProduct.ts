export interface IImageUrls {
	sm: string;
	md: string;
	lg: string;
}

export interface IProduct {
	id: string;
	menuCategoryId: string;
	name: string;
	description: string | null;
	priceCents: number;
	imageKey: string | null;
	imageUrls: IImageUrls | null;
	position: number;
	isAvailable: boolean;
	archivedAt: string | null;
}
