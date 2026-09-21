import { ClockIcon } from 'lucide-react';
import type { PaymentMethod } from 'shared/entities/IOrder';
import { Mask } from 'shared/utils/Mask';
import type { IOrderCardProps } from './OrderCardTypes';
import { formatOrderTime } from './utils/formatOrderTime';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	ONLINE: 'Pix',
	CASH: 'Dinheiro',
	CARD_ON_DELIVERY: 'Cartão na entrega'
};

export function OrderCard({ order }: IOrderCardProps) {
	const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

	return (
		<article className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 shadow-xs">
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
				<span className="font-medium">R$ {Mask.currency(String(order.totalCents))}</span>

				<span className="rounded-md bg-muted px-2 py-0.5 text-body-sm text-muted-foreground">
					{PAYMENT_METHOD_LABELS[order.paymentMethod]}
				</span>
			</footer>
		</article>
	);
}
