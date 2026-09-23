import { ArrowUpDownIcon, InfoIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { ActionModal } from 'presentation/components/ActionModal/ActionModal';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import { Button } from 'presentation/components/Button/Button';
import { DataTable } from 'presentation/components/DataTable/DataTable';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'presentation/components/Select/Select';
import { Switch } from 'presentation/components/Switch/Switch';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { Mask } from 'shared/utils/Mask';
import { ProductFormModal } from './components/ProductFormModal/ProductFormModal';
import { useProductsController } from './useProductsController';

export function Products() {
	const {
		restaurantId,
		menuCategories,
		selectedMenuCategoryId,
		hasMenuCategories,
		visibleProducts,
		reorderIds,
		isLoadingProducts,
		productsErrorMessage,
		isEmpty,
		canReorder,
		isFormModalOpen,
		editingProduct,
		archivingProduct,
		isArchivingProduct,
		togglingProductId,
		isReorderMode,
		isReorderingProducts,
		handleSelectMenuCategory,
		handleOpenCreateModal,
		handleOpenEditModal,
		handleCloseFormModal,
		handleOpenArchiveModal,
		handleCloseArchiveModal,
		handleConfirmArchive,
		handleToggleAvailability,
		handleEnterReorderMode,
		handleCancelReorder,
		handleReorder,
		handleSaveReorder
	} = useProductsController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-title-md">Produtos</h1>

					<p className="text-body-sm text-muted-foreground">
						O que o cliente pede. Cada produto vive dentro de uma categoria.
					</p>
				</div>

				{hasMenuCategories && !isReorderMode ? (
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
							Novo produto
						</Button>
					</div>
				) : null}

				{isReorderMode ? (
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={isReorderingProducts}
							onClick={handleCancelReorder}
						>
							Cancelar
						</Button>

						<Button type="button" isLoading={isReorderingProducts} onClick={handleSaveReorder}>
							Salvar ordem
						</Button>
					</div>
				) : null}
			</header>

			{!hasMenuCategories ? (
				<Alert>
					<InfoIcon aria-hidden="true" />

					<AlertTitle>Crie uma categoria antes</AlertTitle>

					<AlertDescription>
						Todo produto precisa pertencer a uma categoria.{' '}
						<Link to={APP_ROUTES.menuCategories} className="underline underline-offset-4">
							Ir para Categorias
						</Link>
					</AlertDescription>
				</Alert>
			) : null}

			{hasMenuCategories && selectedMenuCategoryId ? (
				<div className="flex w-full flex-col gap-2 sm:max-w-xs">
					<label htmlFor="menuCategoryFilter" className="text-label">
						Categoria
					</label>

					<Select
						value={selectedMenuCategoryId}
						disabled={isReorderMode}
						onValueChange={handleSelectMenuCategory}
					>
						<SelectTrigger id="menuCategoryFilter" className="w-full">
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							{menuCategories.map((menuCategory) => (
								<SelectItem key={menuCategory.id} value={menuCategory.id}>
									{menuCategory.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			) : null}

			{isReorderMode ? (
				<Alert>
					<InfoIcon aria-hidden="true" />

					<AlertTitle>Esta é a ordem que o cliente vê</AlertTitle>

					<AlertDescription>
						Os produtos aparecem nesta sequência dentro da categoria. Arraste pela alça à esquerda e
						clique em "Salvar ordem" para confirmar.
					</AlertDescription>
				</Alert>
			) : null}

			<DataTable.Root columnCount={4}>
				<DataTable.Header>
					{isReorderMode ? (
						<DataTable.Head className="w-12">
							<span className="sr-only">Ordem</span>
						</DataTable.Head>
					) : null}

					<DataTable.Head>Nome</DataTable.Head>

					<DataTable.Head align="right">Preço</DataTable.Head>

					{!isReorderMode ? <DataTable.Head>Disponível</DataTable.Head> : null}

					{!isReorderMode ? <DataTable.Head align="right">Ações</DataTable.Head> : null}
				</DataTable.Header>

				{isReorderMode ? (
					<DataTable.SortableBody ids={reorderIds} onReorder={handleReorder}>
						{visibleProducts.map((product) => (
							<DataTable.SortableRow key={product.id} id={product.id}>
								<DataTable.Cell className="w-12">
									<DataTable.DragHandle>Reordenar {product.name}</DataTable.DragHandle>
								</DataTable.Cell>

								<DataTable.Cell className="font-medium">{product.name}</DataTable.Cell>

								<DataTable.Cell align="right">
									R$ {Mask.currency(String(product.priceCents))}
								</DataTable.Cell>
							</DataTable.SortableRow>
						))}
					</DataTable.SortableBody>
				) : (
					<DataTable.Body>
						{isLoadingProducts ? <DataTable.LoadingRows /> : null}

						{productsErrorMessage ? (
							<DataTable.ErrorRow>{productsErrorMessage}</DataTable.ErrorRow>
						) : null}

						{isEmpty ? (
							<DataTable.EmptyRow>Nenhum produto nesta categoria ainda.</DataTable.EmptyRow>
						) : null}

						{visibleProducts.map((product) => (
							<DataTable.Row key={product.id}>
								<DataTable.Cell>
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">{product.name}</span>

										{product.description ? (
											<span className="line-clamp-1 text-body-sm text-muted-foreground">
												{product.description}
											</span>
										) : null}
									</div>
								</DataTable.Cell>

								<DataTable.Cell align="right">
									R$ {Mask.currency(String(product.priceCents))}
								</DataTable.Cell>

								<DataTable.Cell>
									<Switch
										checked={product.isAvailable}
										disabled={togglingProductId === product.id}
										aria-label={`Disponibilidade de ${product.name}`}
										onCheckedChange={() => handleToggleAvailability(product)}
									/>
								</DataTable.Cell>

								<DataTable.Cell align="right">
									<div className="flex items-center justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											size="icon-sm"
											onClick={() => handleOpenEditModal(product)}
										>
											<PencilIcon aria-hidden="true" />
											<span className="sr-only">Editar {product.name}</span>
										</Button>

										<Button
											type="button"
											variant="destructive"
											size="icon-sm"
											onClick={() => handleOpenArchiveModal(product)}
										>
											<Trash2Icon aria-hidden="true" />
											<span className="sr-only">Arquivar {product.name}</span>
										</Button>
									</div>
								</DataTable.Cell>
							</DataTable.Row>
						))}
					</DataTable.Body>
				)}
			</DataTable.Root>

			{restaurantId && selectedMenuCategoryId ? (
				<ProductFormModal
					isOpen={isFormModalOpen}
					restaurantId={restaurantId}
					menuCategories={menuCategories}
					defaultMenuCategoryId={selectedMenuCategoryId}
					product={editingProduct}
					onClose={handleCloseFormModal}
				/>
			) : null}

			<ActionModal
				isOpen={!!archivingProduct}
				title="Arquivar produto"
				description={
					archivingProduct
						? `"${archivingProduct.name}" sai do cardápio e não há como desfazer. Pedidos antigos continuam mostrando o nome e o preço da época.`
						: ''
				}
				confirmLabel="Arquivar"
				isConfirming={isArchivingProduct}
				onConfirm={handleConfirmArchive}
				onClose={handleCloseArchiveModal}
			/>
		</div>
	);
}
