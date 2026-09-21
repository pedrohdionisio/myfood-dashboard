import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { ActionModal } from 'presentation/components/ActionModal/ActionModal';
import { Button } from 'presentation/components/Button/Button';
import { DataTable } from 'presentation/components/DataTable/DataTable';
import { MenuCategoryFormModal } from './components/MenuCategoryFormModal/MenuCategoryFormModal';
import { useMenuCategoriesController } from './useMenuCategoriesController';

export function MenuCategories() {
	const {
		restaurantId,
		menuCategories,
		isLoadingMenuCategories,
		menuCategoriesErrorMessage,
		isEmpty,
		canManageMenuCategories,
		isFormModalOpen,
		editingMenuCategory,
		archivingMenuCategory,
		isArchivingMenuCategory,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive
	} = useMenuCategoriesController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-title-md">Categorias</h1>

					<p className="text-body-sm text-muted-foreground">
						Agrupe os produtos do cardápio e defina como ele aparece para o cliente.
					</p>
				</div>

				{canManageMenuCategories ? (
					<Button type="button" onClick={handleOpenCreateModal}>
						<PlusIcon aria-hidden="true" />
						Nova categoria
					</Button>
				) : null}
			</header>

			<DataTable.Root columnCount={canManageMenuCategories ? 2 : 1}>
				<DataTable.Header>
					<DataTable.Head>Nome</DataTable.Head>

					{canManageMenuCategories ? <DataTable.Head align="right">Ações</DataTable.Head> : null}
				</DataTable.Header>

				<DataTable.Body>
					{isLoadingMenuCategories ? <DataTable.LoadingRows /> : null}

					{menuCategoriesErrorMessage ? (
						<DataTable.ErrorRow>{menuCategoriesErrorMessage}</DataTable.ErrorRow>
					) : null}

					{isEmpty ? (
						<DataTable.EmptyRow>
							Nenhuma categoria por aqui ainda. Crie a primeira para começar o cardápio.
						</DataTable.EmptyRow>
					) : null}

					{menuCategories.map((menuCategory) => (
						<DataTable.Row key={menuCategory.id}>
							<DataTable.Cell className="font-medium">{menuCategory.name}</DataTable.Cell>

							{canManageMenuCategories ? (
								<DataTable.Cell align="right">
									<div className="flex items-center justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											size="icon-sm"
											onClick={() => handleOpenEditModal(menuCategory)}
										>
											<PencilIcon aria-hidden="true" />
											<span className="sr-only">Renomear {menuCategory.name}</span>
										</Button>

										<Button
											type="button"
											variant="destructive"
											size="icon-sm"
											onClick={() => handleOpenArchiveModal(menuCategory)}
										>
											<Trash2Icon aria-hidden="true" />
											<span className="sr-only">Arquivar {menuCategory.name}</span>
										</Button>
									</div>
								</DataTable.Cell>
							) : null}
						</DataTable.Row>
					))}
				</DataTable.Body>
			</DataTable.Root>

			{restaurantId ? (
				<MenuCategoryFormModal
					isOpen={isFormModalOpen}
					restaurantId={restaurantId}
					menuCategory={editingMenuCategory}
					onClose={handleCloseFormModal}
				/>
			) : null}

			<ActionModal
				isOpen={!!archivingMenuCategory}
				title="Arquivar categoria"
				description={
					archivingMenuCategory
						? `"${archivingMenuCategory.name}" sai do cardápio e não há como desfazer. Categorias com produtos ativos não podem ser arquivadas.`
						: ''
				}
				confirmLabel="Arquivar"
				isConfirming={isArchivingMenuCategory}
				onConfirm={handleConfirmArchive}
				onClose={handleCloseArchiveModal}
			/>
		</div>
	);
}
