import { cn } from 'cn';
import { TriangleAlertIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import { DataTable } from 'presentation/components/DataTable/DataTable';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from 'presentation/components/Pagination/Pagination';
import { RestaurantGateNotice } from 'presentation/components/RestaurantGateNotice/RestaurantGateNotice';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'presentation/components/Select/Select';
import { formatCurrency } from 'shared/utils/formatCurrency';
import { useOrdersHistoryController } from './useOrdersHistoryController';
import { formatOrderDateTime } from './utils/formatOrderDateTime';
import { toStatusTone } from './utils/toStatusTone';

export function OrdersHistory() {
	const {
		restaurantId,
		restaurantGate,
		canSeeHistory,
		orders,
		statusOptions,
		perPageOptions,
		selectedStatus,
		selectedPerPage,
		page,
		hasMoreOrders,
		isLoadingOrders,
		isFetchingOrders,
		ordersErrorMessage,
		isEmpty,
		handleSelectStatus,
		handleSelectPerPage,
		handlePreviousPage,
		handleNextPage
	} = useOrdersHistoryController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-title-md">Histórico de pedidos</h1>

				<p className="text-body-sm text-muted-foreground">
					Todos os pedidos do restaurante, dos mais recentes para os mais antigos.
				</p>
			</header>

			{restaurantId ? (
				<RestaurantGateNotice gate={restaurantGate} restaurantId={restaurantId} />
			) : null}

			{ordersErrorMessage ? (
				<Alert variant="destructive">
					<TriangleAlertIcon aria-hidden="true" />

					<AlertTitle>Não foi possível carregar o histórico</AlertTitle>

					<AlertDescription>{ordersErrorMessage}</AlertDescription>
				</Alert>
			) : null}

			{canSeeHistory ? (
				<>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-end">
						<div className="flex w-full flex-col gap-2 sm:max-w-3xs">
							<label htmlFor="historyStatus" className="text-label">
								Status
							</label>

							<Select value={selectedStatus} onValueChange={handleSelectStatus}>
								<SelectTrigger id="historyStatus" className="w-full">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{statusOptions.map((statusOption) => (
										<SelectItem key={statusOption.value} value={statusOption.value}>
											{statusOption.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex w-full flex-col gap-2 sm:max-w-3xs">
							<label htmlFor="historyPerPage" className="text-label">
								Itens por página
							</label>

							<Select value={selectedPerPage} onValueChange={handleSelectPerPage}>
								<SelectTrigger id="historyPerPage" className="w-full">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{perPageOptions.map((perPageOption) => (
										<SelectItem key={perPageOption.value} value={perPageOption.value}>
											{perPageOption.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div
						data-fetching={isFetchingOrders || undefined}
						className="flex flex-col gap-4 data-fetching:opacity-60"
					>
						<DataTable.Root columnCount={7}>
							<DataTable.Header>
								<DataTable.Head>Pedido</DataTable.Head>

								<DataTable.Head>Data</DataTable.Head>

								<DataTable.Head>Cliente</DataTable.Head>

								<DataTable.Head align="right">Itens</DataTable.Head>

								<DataTable.Head align="right">Total</DataTable.Head>

								<DataTable.Head>Pagamento</DataTable.Head>

								<DataTable.Head>Status</DataTable.Head>
							</DataTable.Header>

							<DataTable.Body>
								{isLoadingOrders ? <DataTable.LoadingRows /> : null}

								{isEmpty ? (
									<DataTable.EmptyRow>Nenhum pedido encontrado com esse filtro.</DataTable.EmptyRow>
								) : null}

								{orders.map((order) => (
									<DataTable.Row key={order.id}>
										<DataTable.Cell className="font-medium">#{order.displayNumber}</DataTable.Cell>

										<DataTable.Cell className="text-muted-foreground">
											{formatOrderDateTime(order.createdAt)}
										</DataTable.Cell>

										<DataTable.Cell>{order.customerName}</DataTable.Cell>

										<DataTable.Cell align="right">{order.itemCount}</DataTable.Cell>

										<DataTable.Cell align="right" className="font-medium">
											{formatCurrency(order.totalCents)}
										</DataTable.Cell>

										<DataTable.Cell className="text-muted-foreground">
											{order.paymentMethodLabel}
										</DataTable.Cell>

										<DataTable.Cell>
											<span
												className={cn(
													'inline-flex rounded-md px-2 py-0.5 text-body-sm',
													toStatusTone(order.status)
												)}
											>
												{order.statusLabel}
											</span>
										</DataTable.Cell>
									</DataTable.Row>
								))}
							</DataTable.Body>
						</DataTable.Root>

						{page > 1 || hasMoreOrders ? (
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious disabled={page === 1} onClick={handlePreviousPage} />
									</PaginationItem>

									<PaginationItem>
										<span className="px-3 text-body-sm text-muted-foreground">Página {page}</span>
									</PaginationItem>

									<PaginationItem>
										<PaginationNext disabled={!hasMoreOrders} onClick={handleNextPage} />
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						) : null}
					</div>
				</>
			) : null}
		</div>
	);
}
