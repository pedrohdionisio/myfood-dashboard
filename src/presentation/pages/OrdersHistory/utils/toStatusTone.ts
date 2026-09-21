import type { OrderStatus } from 'shared/entities/IOrder';

export function toStatusTone(status: OrderStatus): string {
	if (status === 'DELIVERED') {
		return 'bg-success/10 text-success';
	}

	if (status === 'CANCELED' || status === 'REJECTED' || status === 'DELIVERY_FAILED') {
		return 'bg-destructive/10 text-destructive';
	}

	return 'bg-muted text-muted-foreground';
}
