import { PlusIcon } from 'lucide-react';
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
		handleOpenCreateModal,
		handleCloseFormModal
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

			<DataTable.Root columnCount={4}>
				<DataTable.Header>
					<DataTable.Head>Nome</DataTable.Head>

					<DataTable.Head>E-mail</DataTable.Head>

					<DataTable.Head>Telefone</DataTable.Head>

					<DataTable.Head>Situação</DataTable.Head>
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
						</DataTable.Row>
					))}
				</DataTable.Body>
			</DataTable.Root>

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
