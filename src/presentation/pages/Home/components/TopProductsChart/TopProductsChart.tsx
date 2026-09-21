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
import { formatCompactCurrency } from 'presentation/pages/Home/utils/formatCompactCurrency';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Mask } from 'shared/utils/Mask';
import type { ITopProductsChartProps } from './TopProductsChartTypes';
import { truncateProductName } from './utils/truncateProductName';

const TOP_PRODUCTS_CHART_CONFIG = {
	revenueCents: { label: 'Receita', color: 'var(--chart-1)' }
} satisfies ChartConfig;

export function TopProductsChart({ products }: ITopProductsChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Produtos que mais venderam</CardTitle>

				<CardDescription>
					Os dez primeiros por receita no período, com a quantidade vendida ao lado da barra.
				</CardDescription>
			</CardHeader>

			<CardContent>
				{products.length === 0 ? (
					<p className="py-10 text-center text-body-sm text-muted-foreground">
						Nenhum produto vendido no período.
					</p>
				) : (
					<ChartContainer config={TOP_PRODUCTS_CHART_CONFIG} className="aspect-auto h-104 w-full">
						<BarChart
							data={products}
							layout="vertical"
							margin={{ top: 8, right: 56, left: 8, bottom: 8 }}
						>
							<CartesianGrid horizontal={false} />

							<XAxis
								type="number"
								dataKey="revenueCents"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={formatCompactCurrency}
							/>

							<YAxis
								type="category"
								dataKey="productName"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={160}
								tickFormatter={truncateProductName}
							/>

							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										valueFormatter={(cents) => `R$ ${Mask.currency(String(cents))}`}
									/>
								}
							/>

							<Bar
								dataKey="revenueCents"
								maxBarSize={28}
								radius={[0, 4, 4, 0]}
								fill={TOP_PRODUCTS_CHART_CONFIG.revenueCents.color}
							>
								<LabelList
									dataKey="quantity"
									position="right"
									offset={8}
									className="fill-muted-foreground"
									formatter={(quantity) => `${quantity} un`}
								/>
							</Bar>
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
