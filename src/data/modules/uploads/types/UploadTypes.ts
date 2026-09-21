export type ImageKind = 'RESTAURANT_LOGO' | 'RESTAURANT_BANNER' | 'PRODUCT_IMAGE';

export type ImageContentType = 'image/jpeg' | 'image/png' | 'image/webp';

export interface IImageUploadPayload {
	kind: ImageKind;
	contentType: ImageContentType;
}

export interface IImageUpload {
	imageKey: string;
	url: string;
	fields: Record<string, string>;
	maxBytes: number;
	expiresInSeconds: number;
}

export interface IUploadImageVariables {
	restaurantId: string;
	kind: ImageKind;
	file: Blob;
}
