import type { ComponentProps, ComponentType, ReactNode } from 'react';
import type {
	DefaultLegendContentProps,
	DefaultTooltipContentProps,
	ResponsiveContainer,
	TooltipValueType
} from 'recharts';

export type ChartConfig = Record<
	string,
	{
		label?: ReactNode;
		icon?: ComponentType;
		color?: string;
	}
>;

export interface IChartContextValue {
	config: ChartConfig;
}

export interface IChartContainerProps extends ComponentProps<'div'> {
	config: ChartConfig;
	children: ComponentProps<typeof ResponsiveContainer>['children'];
	initialDimension?: {
		width: number;
		height: number;
	};
}

export interface IChartTooltipContentProps
	extends Omit<
		DefaultTooltipContentProps<TooltipValueType, number | string>,
		'accessibilityLayer'
	> {
	active?: boolean;
	color?: string;
	className?: string;
	hideLabel?: boolean;
	hideIndicator?: boolean;
	indicator?: 'line' | 'dot' | 'dashed';
	nameKey?: string;
	labelKey?: string;
	valueFormatter?: (value: number) => string;
}

export interface IChartLegendContentProps extends DefaultLegendContentProps {
	className?: string;
	hideIcon?: boolean;
	nameKey?: string;
}
