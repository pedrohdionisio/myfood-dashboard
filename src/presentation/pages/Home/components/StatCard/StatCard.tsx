import { cn } from 'cn';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader
} from 'presentation/components/Card/Card';
import type { IStatCardProps } from './StatCardTypes';
import { toDeltaCaption } from './utils/toDeltaCaption';

export function StatCard({ label, value, icon: Icon, delta, isGrowthDesirable }: IStatCardProps) {
	const isGrowing = delta !== null && delta > 0;
	const hasTrend = delta !== null && delta !== 0;
	const TrendIcon = isGrowing ? TrendingUpIcon : TrendingDownIcon;

	return (
		<Card className="gap-3 py-5">
			<CardHeader className="gap-0 px-5">
				<CardDescription className="text-eyebrow uppercase">{label}</CardDescription>

				<CardAction>
					<Icon aria-hidden="true" className="size-4 text-muted-foreground" />
				</CardAction>
			</CardHeader>

			<CardContent className="flex flex-col gap-1 px-5">
				<strong className="font-mono text-title-md tabular-nums">{value}</strong>

				<span
					className={cn(
						'flex items-center gap-1 text-body-sm',
						hasTrend && isGrowing === isGrowthDesirable && 'text-success',
						hasTrend && isGrowing !== isGrowthDesirable && 'text-destructive',
						!hasTrend && 'text-muted-foreground'
					)}
				>
					{hasTrend ? <TrendIcon aria-hidden="true" className="size-3.5 shrink-0" /> : null}

					{toDeltaCaption(delta)}
				</span>
			</CardContent>
		</Card>
	);
}
