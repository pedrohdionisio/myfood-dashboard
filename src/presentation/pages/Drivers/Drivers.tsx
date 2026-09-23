import { PlusIcon } from 'lucide-react';
import { ActionModal } from 'presentation/components/ActionModal/ActionModal';
import { Button } from 'presentation/components/Button/Button';
import { DataTable } from 'presentation/components/DataTable/DataTable';
import { Mask } from 'shared/utils/Mask';
import { DriverFormModal } from './components/DriverFormModal/DriverFormModal';
import { useDriversController } from './useDriversController';

export function Drivers() {
	const {
		restaurantId,
		drivers,
		isLoadingDrivers,
		driversErrorMessage,
		isEmpty,
		isFormModalOpen,
		pendingActionCopy,
		isConfirmingAction,
		activatingDriverId,
		handleOpenCreateModal,
		handleCloseFormModal,
		handleRequestAction,
		handleCloseActionModal,
		handleConfirmAction,
		handleActivate
	} = useDriversController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-title-md">Entregadores</h1>

					<p className="text-body-sm text-muted-foreground">
						Quem pode receber o despacho de um pedido pronto.
					</p>
				</div>

				<Button type="button" onClick={handleOpenCreateModal}>
					<PlusIcon aria-hidden="true" />
					Novo entregador
				</Button>
			</header>

			<DataTable.Root columnCount={5}>
				<DataTable.Header>
					<DataTable.Head>Nome</DataTable.Head>

					<DataTable.Head>E-mail</DataTable.Head>

					<DataTable.Head>Telefone</DataTable.Head>

					<DataTable.Head>Situação</DataTable.Head>

					<DataTable.Head align="right">Ações</DataTable.Head>
				</DataTable.Header>

				<DataTable.Body>
					{isLoadingDrivers ? <DataTable.LoadingRows /> : null}

					{driversErrorMessage ? (
						<DataTable.ErrorRow>{driversErrorMessage}</DataTable.ErrorRow>
					) : null}

					{isEmpty ? (
						<DataTable.EmptyRow>
							Nenhum entregador ainda. Cadastre um para conseguir despachar pedidos.
						</DataTable.EmptyRow>
					) : null}

					{drivers.map((driver) => (
						<DataTable.Row key={driver.id}>
							<DataTable.Cell className="font-medium">{driver.name}</DataTable.Cell>

							<DataTable.Cell className="text-muted-foreground">{driver.email}</DataTable.Cell>

							<DataTable.Cell className="text-muted-foreground">
								{driver.phone ? Mask.phone(driver.phone) : '—'}
							</DataTable.Cell>

							<DataTable.Cell>{driver.active ? 'Ativo' : 'Inativo'}</DataTable.Cell>

							<DataTable.Cell align="right">
								<div className="flex items-center justify-end gap-2">
									{driver.active ? (
										<>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => handleRequestAction(driver, 'PROMOTE')}
											>
												Tornar dono
											</Button>

											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => handleRequestAction(driver, 'DEACTIVATE')}
											>
												Desativar
											</Button>
										</>
									) : (
										<Button
											type="button"
											variant="outline"
											size="sm"
											isLoading={activatingDriverId === driver.id}
											onClick={() => handleActivate(driver)}
										>
											Reativar
										</Button>
									)}
								</div>
							</DataTable.Cell>
						</DataTable.Row>
					))}
				</DataTable.Body>
			</DataTable.Root>

			<ActionModal
				isOpen={!!pendingActionCopy}
				title={pendingActionCopy?.title ?? ''}
				description={pendingActionCopy?.description ?? ''}
				confirmLabel={pendingActionCopy?.confirmLabel ?? ''}
				variant="destructive"
				isConfirming={isConfirmingAction}
				onConfirm={handleConfirmAction}
				onClose={handleCloseActionModal}
			/>

			{restaurantId ? (
				<DriverFormModal
					isOpen={isFormModalOpen}
					restaurantId={restaurantId}
					onClose={handleCloseFormModal}
				/>
			) : null}
		</div>
	);
}
