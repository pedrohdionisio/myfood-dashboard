export type ImageKind = 'RESTAURANT_LOGO' | 'RESTAURANT_BANNER' | 'PRODUCT_IMAGE';

export const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number];

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
