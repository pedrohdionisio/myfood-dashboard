import { useMutation } from '@tanstack/react-query';
import { UploadMutationKeys } from 'data/modules/uploads/keys/UploadKeys';
import { UploadsService } from 'data/modules/uploads/services/UploadsService';
import {
	IMAGE_CONTENT_TYPES,
	type IUploadImageVariables
} from 'data/modules/uploads/types/UploadTypes';

export function useUploadImage() {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: [UploadMutationKeys.UPLOAD_IMAGE],
		async mutationFn({ restaurantId, kind, file }: IUploadImageVariables) {
			const contentType = IMAGE_CONTENT_TYPES.find((type) => type === file.type);

			if (!contentType) {
				throw new Error(`Unsupported image type: ${file.type}`);
			}

			const upload = await UploadsService.create(restaurantId, { kind, contentType });

			await UploadsService.sendToStorage(upload, file);

			return upload.imageKey;
		}
	});

	return {
		uploadImage: mutateAsync,
		isUploadingImage: isPending
	};
}
