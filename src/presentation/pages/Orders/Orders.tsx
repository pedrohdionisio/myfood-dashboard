import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import { OrderBoardColumn } from './components/OrderBoardColumn/OrderBoardColumn';
import { useOrdersController } from './useOrdersController';

export function Orders() {
	const { columns, hasTruncatedColumn } = useOrdersController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-title-md">Pedidos</h1>

				<p className="text-body-sm text-muted-foreground">
					O que está em aberto agora, da chegada até sair para entrega.
				</p>
			</header>

			{hasTruncatedColumn ? (
				<Alert>
					<InfoIcon aria-hidden="true" />

					<AlertTitle>Há mais pedidos do que cabe no quadro</AlertTitle>

					<AlertDescription>
						Alguma coluna passou de 20 pedidos e mostra só os mais recentes.
					</AlertDescription>
				</Alert>
			) : null}

			<div className="flex gap-4 overflow-x-auto pb-2">
				{columns.map((column) => (
					<OrderBoardColumn
						key={column.status}
						label={column.label}
						orders={column.orders}
						isLoadingOrders={column.isLoadingOrders}
						ordersErrorMessage={column.ordersErrorMessage}
					/>
				))}
			</div>
		</div>
	);
}
