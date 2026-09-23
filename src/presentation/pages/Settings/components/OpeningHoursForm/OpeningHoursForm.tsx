import { Button } from 'presentation/components/Button/Button';
import { WEEK_DAY_LABELS } from 'shared/constants/weekDays';
import { OpeningHoursDay } from '../OpeningHoursDay/OpeningHoursDay';
import type { IOpeningHoursFormProps } from './OpeningHoursFormTypes';
import { useOpeningHoursFormController } from './useOpeningHoursFormController';

export function OpeningHoursForm({ restaurantId, openingHours }: IOpeningHoursFormProps) {
	const { control, register, isDirty, isSubmitting, handleSubmit } = useOpeningHoursFormController({
		restaurantId,
		openingHours
	});

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border bg-card p-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-title-sm">Horários de funcionamento</h2>

				<p className="text-body-sm text-muted-foreground">
					A loja só aceita pedidos dentro dos turnos cadastrados. Para atender de madrugada, feche
					depois da meia-noite — sexta das 18:00 às 02:00.
				</p>
			</div>

			<div className="flex flex-col">
				{WEEK_DAY_LABELS.map((label, dayOfWeek) => (
					<OpeningHoursDay
						key={label}
						control={control}
						register={register}
						dayOfWeek={dayOfWeek}
						label={label}
					/>
				))}
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={!isDirty} isLoading={isSubmitting}>
					Salvar horários
				</Button>
			</div>
		</form>
	);
}
