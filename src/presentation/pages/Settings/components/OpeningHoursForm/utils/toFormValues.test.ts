import { describe, expect, it } from 'vitest';
import { toFormValues } from './toFormValues';

describe('toFormValues', () => {
	it('builds all seven days, sorting shifts and defaulting closed days', () => {
		const { days } = toFormValues([
			{ id: '2', dayOfWeek: 1, opensAt: '18:00', closesAt: '23:00' },
			{ id: '1', dayOfWeek: 1, opensAt: '11:00', closesAt: '15:00' }
		]);

		expect(days).toHaveLength(7);
		expect(days[0]).toEqual({
			dayOfWeek: 0,
			isOpen: false,
			shifts: [{ opensAt: '11:00', closesAt: '23:00' }]
		});
		expect(days[1]?.shifts).toEqual([
			{ opensAt: '11:00', closesAt: '15:00' },
			{ opensAt: '18:00', closesAt: '23:00' }
		]);
	});
});
