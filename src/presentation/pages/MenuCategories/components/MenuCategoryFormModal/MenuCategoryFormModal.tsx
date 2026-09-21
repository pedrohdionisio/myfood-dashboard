import { Button } from 'presentation/components/Button/Button';
import { Modal } from 'presentation/components/Modal/Modal';
import { TextInput } from 'presentation/components/TextInput/TextInput';
import type { IMenuCategoryFormModalProps } from './MenuCategoryFormModalTypes';
import { useMenuCategoryFormModalController } from './useMenuCategoryFormModalController';

export function MenuCategoryFormModal({
	isOpen,
	restaurantId,
	menuCategory,
	onClose
}: IMenuCategoryFormModalProps) {
	const { register, errors, isEditing, isSubmitting, handleSubmit } =
		useMenuCategoryFormModalController({ isOpen, restaurantId, menuCategory, onClose });

	return (
		<Modal.Root open={isOpen} onOpenChange={onClose}>
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>{isEditing ? 'Renomear categoria' : 'Nova categoria'}</Modal.Title>

					<Modal.Description>
						{isEditing
							? 'O novo nome aparece no cardápio assim que você salvar.'
							: 'Categorias agrupam os produtos do cardápio e entram no fim da lista.'}
					</Modal.Description>
				</Modal.Header>

				<form
					className="flex min-h-0 flex-1 flex-col overflow-hidden"
					onSubmit={handleSubmit}
					noValidate
				>
					<Modal.Body>
						<TextInput
							id="name"
							label="Nome"
							placeholder="Bebidas"
							autoComplete="off"
							error={errors.name?.message}
							{...register('name')}
						/>
					</Modal.Body>

					<Modal.Footer>
						<Modal.Close asChild>
							<Button type="button" variant="outline" disabled={isSubmitting}>
								Cancelar
							</Button>
						</Modal.Close>

						<Button type="submit" isLoading={isSubmitting}>
							{isEditing ? 'Salvar' : 'Criar categoria'}
						</Button>
					</Modal.Footer>
				</form>
			</Modal.Content>
		</Modal.Root>
	);
}
