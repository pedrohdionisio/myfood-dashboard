import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type ProductFormType,
	type ProductPayloadType,
	productSchema
} from 'data/modules/products/schemas/productSchema';
import { useCreateProduct } from 'data/modules/products/useCases/createProduct/useCreateProduct';
import { useUpdateProduct } from 'data/modules/products/useCases/updateProduct/useUpdateProduct';
import { useEffect } from 'react';
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

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<ProductFormType, unknown, ProductPayloadType>({
		resolver: zodResolver(productSchema),
		defaultValues: toFormValues(null, defaultMenuCategoryId)
	});

	useEffect(() => {
		if (isOpen) {
			reset(toFormValues(product, defaultMenuCategoryId));
		}
	}, [isOpen, product, defaultMenuCategoryId, reset]);

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
		isEditing: !!product,
		isSubmitting: isCreatingProduct || isUpdatingProduct,
		handleSubmit: handleSubmit(onSubmit)
	};
}
