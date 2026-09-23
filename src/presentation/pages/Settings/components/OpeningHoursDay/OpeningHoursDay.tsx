import { PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from 'presentation/components/Button/Button';
import { Input } from 'presentation/components/Input/Input';
import { Switch } from 'presentation/components/Switch/Switch';
import { useController, useFieldArray, useFormState } from 'react-hook-form';
import type { IOpeningHoursDayProps } from './OpeningHoursDayTypes';

const EMPTY_SHIFT = { opensAt: '', closesAt: '' };

export function OpeningHoursDay({ control, register, dayOfWeek, label }: IOpeningHoursDayProps) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: `days.${dayOfWeek}.shifts`
	});
	const { errors } = useFormState({ control, name: `days.${dayOfWeek}.shifts` });
	const { field: isOpenField } = useController({ control, name: `days.${dayOfWeek}.isOpen` });

	const shiftErrors = errors.days?.[dayOfWeek]?.shifts;
	const switchId = `opening-hours-day-${dayOfWeek}`;
	const areShiftsDisabled = !isOpenField.value;

	return (
		<div className="flex flex-col gap-3 border-b py-4 last:border-b-0 sm:flex-row sm:gap-6">
			<div className="flex items-center gap-3 sm:w-44 sm:pt-2">
				<Switch
					id={switchId}
					ref={isOpenField.ref}
					checked={isOpenField.value}
					onCheckedChange={isOpenField.onChange}
					onBlur={isOpenField.onBlur}
				/>

				<label htmlFor={switchId} className="text-label">
					{label}
				</label>
			</div>

			<div className="flex flex-1 flex-col gap-2">
				{fields.map((field, index) => {
					const error =
						shiftErrors?.[index]?.opensAt?.message ?? shiftErrors?.[index]?.closesAt?.message;

					return (
						<div key={field.id} className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<Input
									type="time"
									aria-label={`${label}: abre às`}
									aria-invalid={!!error}
									disabled={areShiftsDisabled}
									className="w-32"
									{...register(`days.${dayOfWeek}.shifts.${index}.opensAt`)}
								/>

								<span className="text-body-sm text-muted-foreground">às</span>

								<Input
									type="time"
									aria-label={`${label}: fecha às`}
									aria-invalid={!!error}
									disabled={areShiftsDisabled}
									className="w-32"
									{...register(`days.${dayOfWeek}.shifts.${index}.closesAt`)}
								/>

								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									disabled={areShiftsDisabled || fields.length === 1}
									aria-label={`Remover turno de ${label}`}
									onClick={() => remove(index)}
								>
									<Trash2Icon aria-hidden="true" />
								</Button>
							</div>

							{error ? <p className="text-body-sm text-destructive">{error}</p> : null}
						</div>
					);
				})}

				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="self-start"
					disabled={areShiftsDisabled}
					onClick={() => append(EMPTY_SHIFT)}
				>
					<PlusIcon aria-hidden="true" />
					Adicionar turno
				</Button>
			</div>
		</div>
	);
}
