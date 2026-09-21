import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type ProductFormType,
	type ProductPayloadType,
	productSchema
} from 'data/modules/products/schemas/productSchema';
import { useCreateProduct } from 'data/modules/products/useCases/createProduct/useCreateProduct';
import { useUpdateProduct } from 'data/modules/products/useCases/updateProduct/useUpdateProduct';
import { useUploadImage } from 'data/modules/uploads/useCases/uploadImage/useUploadImage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { IProductFormModalProps } from './ProductFormModalTypes';
import { toFormValues } from './utils/toFormValues';

export function useProductFormModalController({
	isOpen,
	restaurantId,
	defaultMenuCategoryId,
	product,
	onClose
}: IProductFormModalProps) {
	const { createProduct, isCreatingProduct } = useCreateProduct();
	const { updateProduct, isUpdatingProduct } = useUpdateProduct();
	const { uploadImage, isUploadingImage } = useUploadImage();

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isCroppingImage, setIsCroppingImage] = useState(false);

	const localPreviewUrlRef = useRef<string | null>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm<ProductFormType, unknown, ProductPayloadType>({
		resolver: zodResolver(productSchema),
		defaultValues: toFormValues(null, defaultMenuCategoryId)
	});

	const releaseLocalPreviewUrl = useCallback(() => {
		if (localPreviewUrlRef.current) {
			URL.revokeObjectURL(localPreviewUrlRef.current);
			localPreviewUrlRef.current = null;
		}
	}, []);

	useEffect(() => releaseLocalPreviewUrl, [releaseLocalPreviewUrl]);

	useEffect(() => {
		if (isOpen) {
			releaseLocalPreviewUrl();
			reset(toFormValues(product, defaultMenuCategoryId));
			setPreviewUrl(product?.imageUrls?.md ?? null);
			setIsCroppingImage(false);
		}
	}, [isOpen, product, defaultMenuCategoryId, reset, releaseLocalPreviewUrl]);

	async function handleSelectImage(file: Blob) {
		releaseLocalPreviewUrl();

		const url = URL.createObjectURL(file);
		localPreviewUrlRef.current = url;
		setPreviewUrl(url);

		try {
			const imageKey = await uploadImage({ restaurantId, kind: 'PRODUCT_IMAGE', file });

			setValue('imageKey', imageKey, { shouldDirty: true });
		} catch (error) {
			releaseLocalPreviewUrl();
			setPreviewUrl(product?.imageUrls?.md ?? null);
			toast.error(getApiErrorMessage(error));
		}
	}

	function handleRemoveImage() {
		releaseLocalPreviewUrl();
		setPreviewUrl(null);
		setValue('imageKey', null, { shouldDirty: true });
	}

	const handleCroppingChange = useCallback((isCropping: boolean) => {
		setIsCroppingImage(isCropping);
	}, []);

	async function onSubmit(payload: ProductPayloadType) {
		try {
			if (product) {
				await updateProduct({ restaurantId, productId: product.id, ...payload });
				toast.success('Produto atualizado.');
			} else {
				await createProduct({ restaurantId, ...payload });
				toast.success('Produto criado.');
			}

			onClose();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		register,
		control,
		errors,
		previewUrl,
		isEditing: !!product,
		isUploadingImage,
		isCroppingImage,
		isSubmitting: isCreatingProduct || isUpdatingProduct,
		handleSelectImage,
		handleRemoveImage,
		handleCroppingChange,
		handleSubmit: handleSubmit(onSubmit)
	};
}
