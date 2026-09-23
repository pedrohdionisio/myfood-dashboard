import type {
	OpeningHoursFormType,
	ReplaceOpeningHoursPayloadType
} from 'data/modules/openingHours/useCases/replaceOpeningHours/schemas/replaceOpeningHoursSchema';
import type { Control } from 'react-hook-form';
import type { IOpeningHour } from 'shared/entities/IOpeningHour';

export type OpeningHoursFormControl = Control<
	OpeningHoursFormType,
	unknown,
	ReplaceOpeningHoursPayloadType
>;

export interface IOpeningHoursFormProps {
	restaurantId: string;
	openingHours: IOpeningHour[];
}

export interface IUseOpeningHoursFormControllerParams {
	restaurantId: string;
	openingHours: IOpeningHour[];
}
