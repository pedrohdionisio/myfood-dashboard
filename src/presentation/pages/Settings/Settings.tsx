import { TriangleAlertIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'presentation/components/Alert/Alert';
import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import { AcceptingOrdersCard } from './components/AcceptingOrdersCard/AcceptingOrdersCard';
import { OpeningHoursForm } from './components/OpeningHoursForm/OpeningHoursForm';
import { RestaurantImagesForm } from './components/RestaurantImagesForm/RestaurantImagesForm';
import { RestaurantProfileForm } from './components/RestaurantProfileForm/RestaurantProfileForm';
import { useSettingsController } from './useSettingsController';

export function Settings() {
	const {
		restaurantId,
		restaurant,
		openingHours,
		isLoadingOpeningHours,
		openingHoursError,
		isLoadingRestaurant,
		restaurantErrorMessage
	} = useSettingsController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-title-md">Configurações</h1>

				<p className="text-body-sm text-muted-foreground">
					Defina como o restaurante funciona no dia a dia.
				</p>
			</header>

			{restaurantErrorMessage ? (
				<Alert variant="destructive">
					<TriangleAlertIcon aria-hidden="true" />

					<AlertTitle>Não foi possível carregar o cadastro</AlertTitle>

					<AlertDescription>{restaurantErrorMessage}</AlertDescription>
				</Alert>
			) : null}

			{isLoadingRestaurant ? (
				<>
					<Skeleton className="h-28 w-full rounded-xl" />

					<Skeleton className="h-72 w-full rounded-xl" />

					<Skeleton className="h-128 w-full rounded-xl" />
				</>
			) : null}

			{restaurant ? (
				<>
					<AcceptingOrdersCard restaurant={restaurant} />

					<RestaurantImagesForm restaurant={restaurant} />

					<RestaurantProfileForm restaurant={restaurant} />
				</>
			) : null}

			{isLoadingOpeningHours ? <Skeleton className="h-128 w-full rounded-lg" /> : null}

			{openingHoursError ? (
				<p className="rounded-lg border bg-card p-6 text-body-sm text-muted-foreground">
					Não foi possível carregar os horários de funcionamento. Atualize a página para tentar de
					novo.
				</p>
			) : null}

			{!isLoadingOpeningHours && !openingHoursError && restaurantId ? (
				<OpeningHoursForm restaurantId={restaurantId} openingHours={openingHours} />
			) : null}
		</div>
	);
}
