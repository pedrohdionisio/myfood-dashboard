import { api } from 'data/config/api';
import type { IReplaceOpeningHoursPayload } from 'data/modules/openingHours/types/OpeningHoursTypes';
import type { IOpeningHour } from 'shared/entities/IOpeningHour';

async function listOpeningHours(restaurantId: string): Promise<IOpeningHour[]> {
	const { data } = await api.get<IOpeningHour[]>(`/restaurants/${restaurantId}/opening-hours`);

	return data;
}

async function replaceOpeningHours(
	restaurantId: string,
	payload: IReplaceOpeningHoursPayload
): Promise<IOpeningHour[]> {
	const { data } = await api.put<IOpeningHour[]>(
		`/restaurants/${restaurantId}/opening-hours`,
		payload
	);

	return data;
}

export const OpeningHoursService = {
	listOpeningHours,
	replaceOpeningHours
};
