import { cn } from 'cn';
import { type CSSProperties, createContext, use, useId, useMemo } from 'react';
import { Legend, ResponsiveContainer, Tooltip } from 'recharts';
import type {
	IChartContainerProps,
	IChartContextValue,
	IChartLegendContentProps,
	IChartTooltipContentProps
} from './ChartTypes';
import { getPayloadConfigFromPayload } from './utils/getPayloadConfigFromPayload';

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

const ChartContext = createContext<IChartContextValue | null>(null);

function useChart() {
	const context = use(ChartContext);

	if (!context) {
		throw new Error('Chart parts must be used within ChartContainer');
	}

	return context;
}

export function ChartContainer({
	id,
	className,
	children,
	config,
	initialDimension = INITIAL_DIMENSION,
	...props
}: IChartContainerProps) {
	const uniqueId = useId();
	const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;
	const contextValue = useMemo(() => ({ config }), [config]);

	return (
		<ChartContext.Provider value={contextValue}>
			<div
				data-slot="chart"
				data-chart={chartId}
				className={cn(
					"flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
					className
				)}
				{...props}
			>
				<ResponsiveContainer initialDimension={initialDimension}>{children}</ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
}

export const ChartTooltip = Tooltip;

export function ChartTooltipContent({
	active,
	payload,
	className,
	indicator = 'dot',
	hideLabel = false,
	hideIndicator = false,
	label,
	labelFormatter,
	labelClassName,
	formatter,
	color,
	nameKey,
	labelKey,
	valueFormatter
}: IChartTooltipContentProps) {
	const { config } = useChart();

	const tooltipLabel = useMemo(() => {
		if (hideLabel || !payload?.length) {
			return null;
		}

		const [item] = payload;
		const key = `${labelKey ?? item?.dataKey ?? item?.name ?? 'value'}`;
		const itemConfig = getPayloadConfigFromPayload(config, item, key);
		const value =
			!labelKey && typeof label === 'string' ? (config[label]?.label ?? label) : itemConfig?.label;

		if (labelFormatter) {
			return (
				<div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
			);
		}

		if (!value) {
			return null;
		}

		return <div className={cn('font-medium', labelClassName)}>{value}</div>;
	}, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

	if (!active || !payload?.length) {
		return null;
	}

	const nestLabel = payload.length === 1 && indicator !== 'dot';

	return (
		<div
			className={cn(
				'grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
				className
			)}
		>
			{!nestLabel ? tooltipLabel : null}

			<div className="grid gap-1.5">
				{payload
					.filter((item) => item.type !== 'none')
					.map((item, index) => {
						const itemKey = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
						const itemConfig = getPayloadConfigFromPayload(config, item, itemKey);
						const indicatorColor = color ?? item.payload?.fill ?? item.color;

						return (
							<div
								key={itemKey}
								className={cn(
									'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
									indicator === 'dot' && 'items-center'
								)}
							>
								{formatter && item?.value !== undefined && item.name ? (
									formatter(item.value, item.name, item, index, payload)
								) : (
									<>
										{itemConfig?.icon ? (
											<itemConfig.icon />
										) : (
											!hideIndicator && (
												<div
													className={cn(
														'shrink-0 rounded-xs border-(--color-border) bg-(--color-bg)',
														{
															'h-2.5 w-2.5': indicator === 'dot',
															'w-1': indicator === 'line',
															'w-0 border-[1.5px] border-dashed bg-transparent':
																indicator === 'dashed',
															'my-0.5': nestLabel && indicator === 'dashed'
														}
													)}
													style={
														{
															'--color-bg': indicatorColor,
															'--color-border': indicatorColor
														} as CSSProperties
													}
												/>
											)
										)}

										<div
											className={cn(
												'flex flex-1 justify-between leading-none',
												nestLabel ? 'items-end' : 'items-center'
											)}
										>
											<div className="grid gap-1.5">
												{nestLabel ? tooltipLabel : null}

												<span className="text-muted-foreground">
													{itemConfig?.label ?? item.name}
												</span>
											</div>

											{item.value != null && (
												<span className="font-mono font-medium text-foreground tabular-nums">
													{typeof item.value === 'number'
														? (valueFormatter?.(item.value) ?? item.value.toLocaleString())
														: String(item.value)}
												</span>
											)}
										</div>
									</>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
}

export const ChartLegend = Legend;

export function ChartLegendContent({
	className,
	hideIcon = false,
	payload,
	verticalAlign = 'bottom',
	nameKey
}: IChartLegendContentProps) {
	const { config } = useChart();

	if (!payload?.length) {
		return null;
	}

	return (
		<div
			className={cn(
				'flex items-center justify-center gap-4',
				verticalAlign === 'top' ? 'pb-3' : 'pt-3',
				className
			)}
		>
			{payload
				.filter((item) => item.type !== 'none')
				.map((item) => {
					const itemKey = `${nameKey ?? item.dataKey ?? 'value'}`;
					const itemConfig = getPayloadConfigFromPayload(config, item, itemKey);

					return (
						<div
							key={itemKey}
							className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
						>
							{itemConfig?.icon && !hideIcon ? (
								<itemConfig.icon />
							) : (
								<div
									className="h-2 w-2 shrink-0 rounded-xs"
									style={{ backgroundColor: item.color }}
								/>
							)}

							{itemConfig?.label}
						</div>
					);
				})}
		</div>
	);
}
