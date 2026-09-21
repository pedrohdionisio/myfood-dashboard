import { Skeleton } from 'presentation/components/Skeleton/Skeleton';
import { OpeningHoursForm } from './components/OpeningHoursForm/OpeningHoursForm';
import { useSettingsController } from './useSettingsController';

export function Settings() {
	const {
		restaurantId,
		openingHours,
		isLoadingOpeningHours,
		openingHoursError,
		canManageOpeningHours
	} = useSettingsController();

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-title-md">Configurações</h1>

				<p className="text-body-sm text-muted-foreground">
					Defina como o restaurante funciona no dia a dia.
				</p>
			</header>

			{isLoadingOpeningHours ? <Skeleton className="h-128 w-full rounded-lg" /> : null}

			{openingHoursError ? (
				<p className="rounded-lg border bg-card p-6 text-body-sm text-muted-foreground">
					Não foi possível carregar os horários de funcionamento. Atualize a página para tentar de
					novo.
				</p>
			) : null}

			{!isLoadingOpeningHours && !openingHoursError && restaurantId ? (
				<OpeningHoursForm
					restaurantId={restaurantId}
					openingHours={openingHours}
					canManage={canManageOpeningHours}
				/>
			) : null}
		</div>
	);
}
