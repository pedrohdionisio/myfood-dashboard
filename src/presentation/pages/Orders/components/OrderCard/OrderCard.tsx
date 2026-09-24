import { ClockIcon } from 'lucide-react';
import { formatOrderTime } from 'presentation/pages/Orders/utils/formatOrderTime';
import { PAYMENT_METHOD_LABELS } from 'shared/constants/orderLabels';
import { formatCurrency } from 'shared/utils/formatCurrency';
import type { IOrderCardProps } from './OrderCardTypes';

export function OrderCard({ order, onSelect }: IOrderCardProps) {
	const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

	return (
		<button
			type="button"
			onClick={() => onSelect(order)}
			className="flex w-full flex-col gap-3 rounded-xl border border-border bg-background p-4 text-left shadow-xs transition-colors hover:border-ring hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
		>
			<header className="flex items-center justify-between gap-2">
				<span className="font-medium">#{order.displayNumber}</span>

				<span className="flex items-center gap-1 text-body-sm text-muted-foreground">
					<ClockIcon aria-hidden="true" className="size-3.5" />
					{formatOrderTime(order.createdAt)}
				</span>
			</header>

			<div className="flex flex-col gap-1">
				<span className="line-clamp-1 text-body-sm">{order.customer.name}</span>

				<span className="text-body-sm text-muted-foreground">
					{itemCount} {itemCount === 1 ? 'item' : 'itens'} · {order.deliveryNeighborhood}
				</span>
			</div>

			<footer className="flex items-center justify-between gap-2">
				<span className="font-medium">{formatCurrency(order.totalCents)}</span>

				<span className="rounded-md bg-muted px-2 py-0.5 text-body-sm text-muted-foreground">
					{PAYMENT_METHOD_LABELS[order.paymentMethod]}
				</span>
			</footer>
		</button>
	);
}
