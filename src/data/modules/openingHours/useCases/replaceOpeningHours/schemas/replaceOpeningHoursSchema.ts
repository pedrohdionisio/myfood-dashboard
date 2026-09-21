import type { IReplaceOpeningHoursPayload } from 'data/modules/openingHours/types/OpeningHoursTypes';
import { z } from 'zod';

const TIME_OF_DAY_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const shiftSchema = z.object({
	opensAt: z.string(),
	closesAt: z.string()
});

const openingHoursDaySchema = z
	.object({
		dayOfWeek: z.number(),
		isOpen: z.boolean(),
		shifts: z.array(shiftSchema)
	})
	.superRefine(({ isOpen, shifts }, ctx) => {
		if (!isOpen) {
			return;
		}

		shifts.forEach((shift, index) => {
			const isOpensAtValid = TIME_OF_DAY_PATTERN.test(shift.opensAt);
			const isClosesAtValid = TIME_OF_DAY_PATTERN.test(shift.closesAt);

			if (!isOpensAtValid) {
				ctx.addIssue({
					code: 'custom',
					path: ['shifts', index, 'opensAt'],
					message: 'Informe o horário de abertura'
				});
			}

			if (!isClosesAtValid) {
				ctx.addIssue({
					code: 'custom',
					path: ['shifts', index, 'closesAt'],
					message: 'Informe o horário de fechamento'
				});
			}

			if (isOpensAtValid && isClosesAtValid && shift.opensAt === shift.closesAt) {
				ctx.addIssue({
					code: 'custom',
					path: ['shifts', index, 'closesAt'],
					message: 'Para o dia inteiro, use 00:00 às 23:59'
				});
			}
		});
	});

export const replaceOpeningHoursSchema = z
	.object({ days: z.array(openingHoursDaySchema) })
	.transform(
		({ days }): IReplaceOpeningHoursPayload => ({
			shifts: days.flatMap(({ dayOfWeek, isOpen, shifts }) =>
				isOpen ? shifts.map((shift) => ({ dayOfWeek, ...shift })) : []
			)
		})
	);

export type OpeningHoursFormType = z.input<typeof replaceOpeningHoursSchema>;
export type ReplaceOpeningHoursPayloadType = z.output<typeof replaceOpeningHoursSchema>;
