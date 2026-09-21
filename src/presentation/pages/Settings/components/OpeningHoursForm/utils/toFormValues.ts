import type { OpeningHoursFormType } from 'data/modules/openingHours/useCases/replaceOpeningHours/schemas/replaceOpeningHoursSchema';
import { WEEK_DAY_LABELS } from 'shared/constants/weekDays';
import type { IOpeningHour } from 'shared/entities/IOpeningHour';

const DEFAULT_SHIFT = { opensAt: '11:00', closesAt: '23:00' };

export function toFormValues(openingHours: IOpeningHour[]): OpeningHoursFormType {
	return {
		days: WEEK_DAY_LABELS.map((_label, dayOfWeek) => {
			const shifts = openingHours
				.filter((shift) => shift.dayOfWeek === dayOfWeek)
				.sort((first, second) => first.opensAt.localeCompare(second.opensAt))
				.map(({ opensAt, closesAt }) => ({ opensAt, closesAt }));

			return {
				dayOfWeek,
				isOpen: shifts.length > 0,
				shifts: shifts.length > 0 ? shifts : [{ ...DEFAULT_SHIFT }]
			};
		})
	};
}
