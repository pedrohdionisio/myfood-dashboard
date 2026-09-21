import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from 'presentation/components/Card/Card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from 'presentation/components/Chart/Chart';
import type { ChartConfig } from 'presentation/components/Chart/ChartTypes';
import { formatPrepTime } from 'presentation/pages/Home/utils/formatPrepTime';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import type { IPrepTimeChartProps } from './PrepTimeChartTypes';

const PREP_TIME_CHART_CONFIG = {
	avgPrepSeconds: { label: 'Tempo médio de preparo', color: 'var(--chart-4)' }
} satisfies ChartConfig;

export function PrepTimeChart({ series }: IPrepTimeChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Tempo de preparo</CardTitle>

				<CardDescription>
					Média entre aceitar o pedido e marcá-lo como pronto, dia a dia.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={PREP_TIME_CHART_CONFIG} className="aspect-auto h-64 w-full">
					<LineChart data={series} margin={{ top: 8, right: 8, left: 8 }}>
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
							width={64}
							tickFormatter={formatPrepTime}
						/>

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" valueFormatter={formatPrepTime} />}
						/>

						<Line
							dataKey="avgPrepSeconds"
							type="monotone"
							strokeWidth={2}
							dot={false}
							connectNulls
							stroke={PREP_TIME_CHART_CONFIG.avgPrepSeconds.color}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
