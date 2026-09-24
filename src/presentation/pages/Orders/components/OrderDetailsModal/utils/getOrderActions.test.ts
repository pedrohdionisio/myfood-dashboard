import { describe, expect, it } from 'vitest';
import { getOrderActions } from './getOrderActions';

describe('getOrderActions', () => {
	it('follows the order state machine', () => {
		expect(getOrderActions('PENDING').map((action) => action.transition)).toEqual([
			'reject',
			'confirm'
		]);
		expect(getOrderActions('PREPARING').map((action) => action.transition)).toEqual([
			'cancel',
			'ready'
		]);
		expect(getOrderActions('OUT_FOR_DELIVERY').map((action) => action.transition)).toEqual([
			'delivery-failed'
		]);
		expect(getOrderActions('DELIVERED')).toEqual([]);
	});

	it('asks for confirmation only on destructive actions', () => {
		for (const action of getOrderActions('CONFIRMED')) {
			expect(action.isDestructive).toBe(action.transition === 'cancel');
		}
	});
});
