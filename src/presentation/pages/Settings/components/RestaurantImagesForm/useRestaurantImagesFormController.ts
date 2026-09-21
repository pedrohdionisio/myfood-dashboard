import { getApiErrorMessage } from 'data/config/apiError';
import { useUpdateRestaurant } from 'data/modules/restaurants/useCases/updateRestaurant/useUpdateRestaurant';
import { useUploadImage } from 'data/modules/uploads/useCases/uploadImage/useUploadImage';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { IRestaurantImagesFormProps, RestaurantImageKind } from './RestaurantImagesFormTypes';
import { toImageKeyPayload } from './utils/toImageKeyPayload';

export function useRestaurantImagesFormController({ restaurant }: IRestaurantImagesFormProps) {
	const { uploadImage } = useUploadImage();
	const { updateRestaurant } = useUpdateRestaurant();

	const [savingKind, setSavingKind] = useState<RestaurantImageKind | null>(null);

	async function handleSelectImage(kind: RestaurantImageKind, file: Blob) {
		setSavingKind(kind);

		try {
			const imageKey = await uploadImage({ restaurantId: restaurant.id, kind, file });

			await updateRestaurant({
				restaurantId: restaurant.id,
				...toImageKeyPayload(kind, imageKey)
			});

			toast.success('Imagem enviada. Ela pode levar alguns segundos para aparecer.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSavingKind(null);
		}
	}

	async function handleRemoveImage(kind: RestaurantImageKind) {
		setSavingKind(kind);

		try {
			await updateRestaurant({
				restaurantId: restaurant.id,
				...toImageKeyPayload(kind, null)
			});

			toast.success('Imagem removida.');
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSavingKind(null);
		}
	}

	return {
		logoUrl: restaurant.logoUrls?.md ?? null,
		bannerUrl: restaurant.bannerUrls?.lg ?? null,
		isSavingLogo: savingKind === 'RESTAURANT_LOGO',
		isSavingBanner: savingKind === 'RESTAURANT_BANNER',
		handleSelectImage,
		handleRemoveImage
	};
}
