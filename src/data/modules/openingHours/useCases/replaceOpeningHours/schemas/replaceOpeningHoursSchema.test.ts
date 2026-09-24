import { describe, expect, it } from 'vitest';
import { replaceOpeningHoursSchema } from './replaceOpeningHoursSchema';

describe('replaceOpeningHoursSchema', () => {
	it('flattens open days into shifts and skips closed ones', () => {
		expect(
			replaceOpeningHoursSchema.parse({
				days: [
					{ dayOfWeek: 0, isOpen: false, shifts: [{ opensAt: '11:00', closesAt: '23:00' }] },
					{
						dayOfWeek: 1,
						isOpen: true,
						shifts: [
							{ opensAt: '11:00', closesAt: '15:00' },
							{ opensAt: '18:00', closesAt: '23:00' }
						]
					}
				]
			})
		).toEqual({
			shifts: [
				{ dayOfWeek: 1, opensAt: '11:00', closesAt: '15:00' },
				{ dayOfWeek: 1, opensAt: '18:00', closesAt: '23:00' }
			]
		});
	});

	it('ignores invalid times on closed days', () => {
		expect(
			replaceOpeningHoursSchema.safeParse({
				days: [{ dayOfWeek: 0, isOpen: false, shifts: [{ opensAt: '', closesAt: '' }] }]
			}).success
		).toBe(true);
	});

	it('rejects missing times and a shift that opens and closes at once', () => {
		const result = replaceOpeningHoursSchema.safeParse({
			days: [
				{
					dayOfWeek: 2,
					isOpen: true,
					shifts: [
						{ opensAt: '', closesAt: '25:00' },
						{ opensAt: '10:00', closesAt: '10:00' }
					]
				}
			]
		});

		expect(result.error?.issues.map((issue) => issue.message)).toEqual([
			'Informe o horário de abertura',
			'Informe o horário de fechamento',
			'Para o dia inteiro, use 00:00 às 23:59'
		]);
	});
});
