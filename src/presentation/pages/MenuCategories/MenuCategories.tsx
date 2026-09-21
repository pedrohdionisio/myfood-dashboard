import { ArrowUpDownIcon, InfoIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { ActionModal } from 'presentation/components/ActionModal/ActionModal';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import { Button } from 'presentation/components/Button/Button';
import { DataTable } from 'presentation/components/DataTable/DataTable';
import { MenuCategoryFormModal } from './components/MenuCategoryFormModal/MenuCategoryFormModal';
import { useMenuCategoriesController } from './useMenuCategoriesController';

export function MenuCategories() {
	const {
		restaurantId,
		visibleMenuCategories,
		reorderIds,
		isLoadingMenuCategories,
		menuCategoriesErrorMessage,
		isEmpty,
		canManageMenuCategories,
		canReorder,
		isFormModalOpen,
		editingMenuCategory,
		archivingMenuCategory,
		isArchivingMenuCategory,
		isReorderMode,
		isReorderingMenuCategories,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive,
		handleEnterReorderMode,
		handleCancelReorder,
		handleReorder,
		handleSaveReorder
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

				{canManageMenuCategories && !isReorderMode ? (
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={!canReorder}
							onClick={handleEnterReorderMode}
						>
							<ArrowUpDownIcon aria-hidden="true" />
							Reordenar
						</Button>

						<Button type="button" onClick={handleOpenCreateModal}>
							<PlusIcon aria-hidden="true" />
							Nova categoria
						</Button>
					</div>
				) : null}

				{canManageMenuCategories && isReorderMode ? (
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={isReorderingMenuCategories}
							onClick={handleCancelReorder}
						>
							Cancelar
						</Button>

						<Button
							type="button"
							isLoading={isReorderingMenuCategories}
							onClick={handleSaveReorder}
						>
							Salvar ordem
						</Button>
					</div>
				) : null}
			</header>

			<Alert>
				<InfoIcon aria-hidden="true" />

				<AlertTitle>Esta é a ordem que o cliente vê</AlertTitle>

				<AlertDescription>
					As categorias aparecem no cardápio nesta mesma sequência, de cima para baixo.
					{isReorderMode
						? ' Arraste pela alça à esquerda e clique em "Salvar ordem" para confirmar.'
						: null}
				</AlertDescription>
			</Alert>

			<DataTable.Root columnCount={canManageMenuCategories ? 2 : 1}>
				<DataTable.Header>
					{isReorderMode ? (
						<DataTable.Head className="w-12">
							<span className="sr-only">Ordem</span>
						</DataTable.Head>
					) : null}

					<DataTable.Head>Nome</DataTable.Head>

					{canManageMenuCategories && !isReorderMode ? (
						<DataTable.Head align="right">Ações</DataTable.Head>
					) : null}
				</DataTable.Header>

				{isReorderMode ? (
					<DataTable.SortableBody ids={reorderIds} onReorder={handleReorder}>
						{visibleMenuCategories.map((menuCategory) => (
							<DataTable.SortableRow key={menuCategory.id} id={menuCategory.id}>
								<DataTable.Cell className="w-12">
									<DataTable.DragHandle>Reordenar {menuCategory.name}</DataTable.DragHandle>
								</DataTable.Cell>

								<DataTable.Cell className="font-medium">{menuCategory.name}</DataTable.Cell>
							</DataTable.SortableRow>
						))}
					</DataTable.SortableBody>
				) : (
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

						{visibleMenuCategories.map((menuCategory) => (
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
				)}
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
