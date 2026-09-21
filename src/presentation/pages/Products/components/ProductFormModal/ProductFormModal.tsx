import { Button } from 'presentation/components/Button/Button';
import { Modal } from 'presentation/components/Modal/Modal';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'presentation/components/Select/Select';
import { TextareaInput } from 'presentation/components/TextareaInput/TextareaInput';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import { Controller } from 'react-hook-form';
import { Mask } from 'shared/utils/Mask';
import type { IProductFormModalProps } from './ProductFormModalTypes';
import { useProductFormModalController } from './useProductFormModalController';

export function ProductFormModal({
	isOpen,
	restaurantId,
	menuCategories,
	defaultMenuCategoryId,
	product,
	onClose
}: IProductFormModalProps) {
	const { register, control, errors, isEditing, isSubmitting, handleSubmit } =
		useProductFormModalController({
			isOpen,
			restaurantId,
			menuCategories,
			defaultMenuCategoryId,
			product,
			onClose
		});

	return (
		<Modal.Root open={isOpen} onOpenChange={onClose}>
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>{isEditing ? 'Editar produto' : 'Novo produto'}</Modal.Title>

					<Modal.Description>
						{isEditing
							? 'As mudanças aparecem no cardápio assim que você salvar.'
							: 'O produto entra no fim da categoria escolhida.'}
					</Modal.Description>
				</Modal.Header>

				<form
					className="flex min-h-0 flex-1 flex-col overflow-hidden"
					onSubmit={handleSubmit}
					noValidate
				>
					<Modal.Body>
						<div className="flex w-full flex-col gap-2">
							<label htmlFor="menuCategoryId" className="text-label">
								Categoria
							</label>

							<Controller
								control={control}
								name="menuCategoryId"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											id="menuCategoryId"
											className="w-full"
											aria-invalid={!!errors.menuCategoryId}
										>
											<SelectValue placeholder="Escolha uma categoria" />
										</SelectTrigger>

										<SelectContent>
											{menuCategories.map((menuCategory) => (
												<SelectItem key={menuCategory.id} value={menuCategory.id}>
													{menuCategory.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							{errors.menuCategoryId ? (
								<p className="text-body-sm text-destructive">{errors.menuCategoryId.message}</p>
							) : null}
						</div>

						<TextInput
							id="name"
							label="Nome"
							placeholder="Coca-Cola 350ml"
							autoComplete="off"
							error={errors.name?.message}
							{...register('name')}
						/>

						<TextInput
							id="price"
							label="Preço"
							placeholder="0,00"
							inputMode="numeric"
							autoComplete="off"
							startIcon={<span className="text-body-sm">R$</span>}
							mask={Mask.currency}
							error={errors.price?.message}
							{...register('price')}
						/>

						<TextareaInput
							id="description"
							label="Descrição"
							placeholder="Como o cliente vê este produto no cardápio."
							rows={4}
							error={errors.description?.message}
							{...register('description')}
						/>
					</Modal.Body>

					<Modal.Footer>
						<Modal.Close asChild>
							<Button type="button" variant="outline" disabled={isSubmitting}>
								Cancelar
							</Button>
						</Modal.Close>

						<Button type="submit" isLoading={isSubmitting}>
							{isEditing ? 'Salvar' : 'Criar produto'}
						</Button>
					</Modal.Footer>
				</form>
			</Modal.Content>
		</Modal.Root>
	);
}
