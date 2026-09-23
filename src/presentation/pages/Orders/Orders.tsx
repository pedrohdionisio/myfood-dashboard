import { RestaurantGateNotice } from 'presentation/components/RestaurantGateNotice/RestaurantGateNotice';
import { OrderBoardColumn } from './components/OrderBoardColumn/OrderBoardColumn';
import { OrderDetailsModal } from './components/OrderDetailsModal/OrderDetailsModal';
import { useOrdersController } from './useOrdersController';

export function Orders() {
	const {
		restaurantId,
		restaurantGate,
		isBoardVisible,
		selectedOrder,
		columns,
		handleSelectOrder,
		handleCloseDetailsModal
	} = useOrdersController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-title-md">Pedidos</h1>

				<p className="text-body-sm text-muted-foreground">
					O que está em aberto agora, da chegada até sair para entrega.
				</p>
			</header>

			{restaurantId ? (
				<RestaurantGateNotice gate={restaurantGate} restaurantId={restaurantId} />
			) : null}

			{restaurantId && isBoardVisible ? (
				<div className="flex gap-4 overflow-x-auto pb-2">
					{columns.map((column) => (
						<OrderBoardColumn
							key={column.status}
							restaurantId={restaurantId}
							status={column.status}
							label={column.label}
							createdSince={column.createdSince}
							onSelectOrder={handleSelectOrder}
						/>
					))}
				</div>
			) : null}

			{restaurantId && isBoardVisible ? (
				<OrderDetailsModal
					isOpen={!!selectedOrder}
					restaurantId={restaurantId}
					order={selectedOrder}
					onClose={handleCloseDetailsModal}
				/>
			) : null}
		</div>
	);
}
