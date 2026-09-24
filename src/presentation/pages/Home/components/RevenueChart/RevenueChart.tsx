import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from 'presentation/components/Chart/Chart';
import type { ChartConfig } from 'presentation/components/Chart/ChartTypes';
import { formatCompactCurrency } from 'presentation/pages/Home/utils/formatCompactCurrency';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { formatCurrency } from 'shared/utils/formatCurrency';
import type { IRevenueChartProps } from './RevenueChartTypes';

const REVENUE_CHART_CONFIG = {
	grossRevenueCents: { label: 'Receita bruta', color: 'var(--chart-1)' },
	deliveryFeeRevenueCents: { label: 'Taxa de entrega', color: 'var(--chart-2)' }
} satisfies ChartConfig;

export function RevenueChart({ series }: IRevenueChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Receita por dia</CardTitle>

				<CardDescription>
					O que os pedidos entregues somaram, e quanto disso foi taxa de entrega.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={REVENUE_CHART_CONFIG} className="aspect-auto h-72 w-full">
					<AreaChart data={series} margin={{ top: 8, right: 8, left: 8 }}>
						<defs>
							<linearGradient id="grossRevenueFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor={REVENUE_CHART_CONFIG.grossRevenueCents.color}
									stopOpacity={0.35}
								/>

								<stop
									offset="100%"
									stopColor={REVENUE_CHART_CONFIG.grossRevenueCents.color}
									stopOpacity={0}
								/>
							</linearGradient>

							<linearGradient id="deliveryFeeRevenueFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor={REVENUE_CHART_CONFIG.deliveryFeeRevenueCents.color}
									stopOpacity={0.3}
								/>

								<stop
									offset="100%"
									stopColor={REVENUE_CHART_CONFIG.deliveryFeeRevenueCents.color}
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>

						<CartesianGrid vertical={false} />

						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={24}
							interval="preserveStartEnd"
						/>

						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={72}
							tickFormatter={formatCompactCurrency}
						/>

						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									indicator="dot"
									valueFormatter={(cents) => formatCurrency(cents)}
								/>
							}
						/>

						<Area
							dataKey="grossRevenueCents"
							type="monotone"
							strokeWidth={2}
							stroke={REVENUE_CHART_CONFIG.grossRevenueCents.color}
							fill="url(#grossRevenueFill)"
						/>

						<Area
							dataKey="deliveryFeeRevenueCents"
							type="monotone"
							strokeWidth={2}
							stroke={REVENUE_CHART_CONFIG.deliveryFeeRevenueCents.color}
							fill="url(#deliveryFeeRevenueFill)"
						/>

						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
