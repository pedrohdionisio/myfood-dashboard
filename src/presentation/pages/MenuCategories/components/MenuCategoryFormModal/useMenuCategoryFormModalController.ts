import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorMessage } from 'data/config/apiError';
import {
	type MenuCategoryFormType,
	menuCategorySchema
} from 'data/modules/menuCategories/schemas/menuCategorySchema';
import { useCreateMenuCategory } from 'data/modules/menuCategories/useCases/createMenuCategory/useCreateMenuCategory';
import { useUpdateMenuCategory } from 'data/modules/menuCategories/useCases/updateMenuCategory/useUpdateMenuCategory';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { IMenuCategoryFormModalProps } from './MenuCategoryFormModalTypes';

export function useMenuCategoryFormModalController({
	isOpen,
	restaurantId,
	menuCategory,
	onClose
}: IMenuCategoryFormModalProps) {
	const { createMenuCategory, isCreatingMenuCategory } = useCreateMenuCategory();
	const { updateMenuCategory, isUpdatingMenuCategory } = useUpdateMenuCategory();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<MenuCategoryFormType>({
		resolver: zodResolver(menuCategorySchema),
		defaultValues: { name: '' }
	});

	useEffect(() => {
		if (isOpen) {
			reset({ name: menuCategory?.name ?? '' });
		}
	}, [isOpen, menuCategory, reset]);

	async function onSubmit(formData: MenuCategoryFormType) {
		try {
			if (menuCategory) {
				await updateMenuCategory({ restaurantId, menuCategoryId: menuCategory.id, ...formData });
				toast.success('Categoria renomeada.');
			} else {
				await createMenuCategory({ restaurantId, ...formData });
				toast.success('Categoria criada.');
			}

			onClose();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	}

	return {
		register,
		errors,
		isEditing: !!menuCategory,
		isSubmitting: isCreatingMenuCategory || isUpdatingMenuCategory,
		handleSubmit: handleSubmit(onSubmit)
	};
}
