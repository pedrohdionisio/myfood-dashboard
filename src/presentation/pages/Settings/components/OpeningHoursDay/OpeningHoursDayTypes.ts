import type { OpeningHoursFormType } from 'data/modules/openingHours/useCases/replaceOpeningHours/schemas/replaceOpeningHoursSchema';
import type { OpeningHoursFormControl } from 'presentation/pages/Settings/components/OpeningHoursForm/OpeningHoursFormTypes';
import type { UseFormRegister } from 'react-hook-form';

export interface IOpeningHoursDayProps {
	control: OpeningHoursFormControl;
	register: UseFormRegister<OpeningHoursFormType>;
	dayOfWeek: number;
	label: string;
	isDisabled: boolean;
}
