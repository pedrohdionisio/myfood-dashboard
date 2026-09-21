import type { IShift } from 'shared/entities/IOpeningHour';

export interface IReplaceOpeningHoursPayload {
	shifts: IShift[];
}

export interface IReplaceOpeningHoursVariables extends IReplaceOpeningHoursPayload {
	restaurantId: string;
}
