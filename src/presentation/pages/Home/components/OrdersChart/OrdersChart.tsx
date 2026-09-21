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
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import type { IOrdersChartProps } from './OrdersChartTypes';

const ORDERS_CHART_CONFIG = {
	deliveredCount: { label: 'Entregues', color: 'var(--chart-3)' },
	canceledCount: { label: 'Cancelados', color: 'var(--destructive)' },
	ordersCount: { label: 'Recebidos', color: 'var(--chart-2)' }
} satisfies ChartConfig;

export function OrdersChart({ series }: IOrdersChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Pedidos por dia</CardTitle>

				<CardDescription>
					Quantos chegaram e como terminaram. A barra conta pelo dia em que o pedido entrou.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={ORDERS_CHART_CONFIG} className="aspect-auto h-72 w-full">
					<ComposedChart data={series} margin={{ top: 8, right: 8, left: 8 }}>
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
							width={40}
							allowDecimals={false}
						/>

						<ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

						<Bar
							dataKey="deliveredCount"
							stackId="outcome"
							fill={ORDERS_CHART_CONFIG.deliveredCount.color}
							radius={[0, 0, 4, 4]}
						/>

						<Bar
							dataKey="canceledCount"
							stackId="outcome"
							fill={ORDERS_CHART_CONFIG.canceledCount.color}
							radius={[4, 4, 0, 0]}
						/>

						<Line
							dataKey="ordersCount"
							type="monotone"
							strokeWidth={2}
							dot={false}
							stroke={ORDERS_CHART_CONFIG.ordersCount.color}
						/>

						<ChartLegend content={<ChartLegendContent />} />
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
