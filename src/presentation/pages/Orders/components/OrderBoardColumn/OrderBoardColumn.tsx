import { TriangleAlertIcon } from 'lucide-react';
import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import { OrderCard } from '../OrderCard/OrderCard';
import type { IOrderBoardColumnProps } from './OrderBoardColumnTypes';

const SKELETON_KEYS = ['first', 'second'];

export function OrderBoardColumn({
	label,
	orders,
	isLoadingOrders,
	ordersErrorMessage
}: IOrderBoardColumnProps) {
	const isEmpty = !isLoadingOrders && !ordersErrorMessage && orders.length === 0;

	return (
		<section className="flex min-w-72 flex-1 flex-col gap-3 rounded-xl bg-muted/40 p-3">
			<header className="flex items-center justify-between gap-2 px-1">
				<h2 className="text-label">{label}</h2>

				<span className="rounded-md bg-background px-2 py-0.5 text-body-sm text-muted-foreground tabular-nums">
					{orders.length}
				</span>
			</header>

			<div className="flex flex-col gap-3">
				{isLoadingOrders
					? SKELETON_KEYS.map((skeletonKey) => (
							<Skeleton key={skeletonKey} className="h-28 w-full rounded-xl" />
						))
					: null}

				{ordersErrorMessage ? (
					<div className="flex flex-col items-center gap-2 rounded-xl border border-border border-dashed p-6 text-center">
						<TriangleAlertIcon aria-hidden="true" className="size-5 text-destructive" />

						<p className="text-body-sm text-muted-foreground">{ordersErrorMessage}</p>
					</div>
				) : null}

				{isEmpty ? (
					<p className="rounded-xl border border-border border-dashed p-6 text-center text-body-sm text-muted-foreground">
						Nenhum pedido aqui.
					</p>
				) : null}

				{orders.map((order) => (
					<OrderCard key={order.id} order={order} />
				))}
			</div>
		</section>
	);
}
