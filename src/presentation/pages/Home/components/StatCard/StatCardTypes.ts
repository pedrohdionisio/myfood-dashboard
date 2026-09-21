import type { LucideIcon } from 'lucide-react';

export interface IStatCardProps {
	label: string;
	value: string;
	icon: LucideIcon;
	delta: number | null;
	isGrowthDesirable: boolean;
}
