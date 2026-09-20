import { cn } from 'cn';
import { ChevronRightIcon } from 'lucide-react';
import type { RestaurantStatus } from 'shared/entities/IRestaurant';
import type { MemberRole } from 'shared/entities/IRestaurantMembership';
import type { IRestaurantOptionProps } from './RestaurantOptionTypes';

const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
	OWNER: 'Dono',
	DRIVER: 'Entregador'
};

const RESTAURANT_STATUS_LABELS: Record<RestaurantStatus, string> = {
	DRAFT: 'Rascunho',
	ACTIVE: 'Aberto',
	SUSPENDED: 'Suspenso'
};

const RESTAURANT_STATUS_STYLES: Record<RestaurantStatus, string> = {
	DRAFT: 'bg-muted text-muted-foreground',
	ACTIVE: 'bg-success/10 text-success',
	SUSPENDED: 'bg-destructive/10 text-destructive'
};

export function RestaurantOption({ restaurant, onSelect }: IRestaurantOptionProps) {
	const { restaurantId, tradeName, role, restaurantStatus } = restaurant;

	return (
		<button
			type="button"
			onClick={() => onSelect(restaurantId)}
			className="flex w-full items-center justify-between gap-4 rounded-lg border bg-card p-4 text-left outline-none transition-colors hover:border-brand hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			<span className="flex flex-col gap-1">
				<span className="text-title-sm text-card-foreground">{tradeName}</span>
				<span className="text-body-sm text-muted-foreground">{MEMBER_ROLE_LABELS[role]}</span>
			</span>

			<span className="flex items-center gap-3">
				<span
					className={cn(
						'rounded-full px-2.5 py-1 text-eyebrow uppercase',
						RESTAURANT_STATUS_STYLES[restaurantStatus]
					)}
				>
					{RESTAURANT_STATUS_LABELS[restaurantStatus]}
				</span>

				<ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden="true" />
			</span>
		</button>
	);
}
