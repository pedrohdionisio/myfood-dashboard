import { TriangleAlertIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import { RestaurantGateNotice } from 'presentation/components/RestaurantGateNotice/RestaurantGateNotice';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'presentation/components/Select/Select';
import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import { OrdersChart } from './components/OrdersChart/OrdersChart';
import { PrepTimeChart } from './components/PrepTimeChart/PrepTimeChart';
import { RevenueChart } from './components/RevenueChart/RevenueChart';
import { StatCard } from './components/StatCard/StatCard';
import { TopProductsChart } from './components/TopProductsChart/TopProductsChart';
import { useHomeController } from './useHomeController';

export function Home() {
	const {
		userName,
		restaurantId,
		restaurantGate,
		canSeeAnalytics,
		isAnalyticsBlockedByRole,
		periodOptions,
		selectedPeriod,
		statCards,
		dailySeries,
		topProducts,
		isLoadingAnalytics,
		analyticsErrorMessage,
		handleSelectPeriod
	} = useHomeController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-title-md">Olá, {userName}</h1>

					<p className="text-body-sm text-muted-foreground">Acompanhe seu restaurante por aqui.</p>
				</div>

				{canSeeAnalytics ? (
					<div className="flex w-full flex-col gap-2 sm:max-w-3xs">
						<label htmlFor="analyticsPeriod" className="text-label">
							Período
						</label>

						<Select value={selectedPeriod} onValueChange={handleSelectPeriod}>
							<SelectTrigger id="analyticsPeriod" className="w-full">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								{periodOptions.map((periodOption) => (
									<SelectItem key={periodOption.value} value={periodOption.value}>
										{periodOption.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				) : null}
			</header>

			{restaurantId ? (
				<RestaurantGateNotice gate={restaurantGate} restaurantId={restaurantId} />
			) : null}

			{isAnalyticsBlockedByRole ? (
				<p className="text-body-sm text-muted-foreground">
					Os números do restaurante aparecem para quem é dono dele.
				</p>
			) : null}

			{analyticsErrorMessage ? (
				<Alert variant="destructive">
					<TriangleAlertIcon aria-hidden="true" />

					<AlertTitle>Não foi possível carregar os números</AlertTitle>

					<AlertDescription>{analyticsErrorMessage}</AlertDescription>
				</Alert>
			) : null}

			{isLoadingAnalytics ? (
				<div className="flex flex-col gap-4">
					<Skeleton className="h-28 w-full rounded-xl" />

					<Skeleton className="h-72 w-full rounded-xl" />

					<Skeleton className="h-72 w-full rounded-xl" />
				</div>
			) : null}

			{statCards.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{statCards.map((statCard) => (
						<StatCard
							key={statCard.id}
							label={statCard.label}
							value={statCard.value}
							icon={statCard.icon}
							delta={statCard.delta}
							isGrowthDesirable={statCard.isGrowthDesirable}
						/>
					))}
				</div>
			) : null}

			{dailySeries.length > 0 ? (
				<div className="flex flex-col gap-4">
					<RevenueChart series={dailySeries} />

					<div className="grid gap-4 xl:grid-cols-2">
						<OrdersChart series={dailySeries} />

						<PrepTimeChart series={dailySeries} />
					</div>

					<TopProductsChart products={topProducts} />
				</div>
			) : null}
		</div>
	);
}
