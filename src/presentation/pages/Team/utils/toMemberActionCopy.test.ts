import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';
import { describe, expect, it } from 'vitest';
import { toMemberActionCopy } from './toMemberActionCopy';

const driver: IRestaurantMember = {
	id: 'member-1',
	userId: 'user-2',
	name: 'João',
	email: 'joao@myfood.com',
	phone: null,
	role: 'DRIVER',
	active: true
};

describe('toMemberActionCopy', () => {
	it('should warn about routes in progress when deactivating a driver', () => {
		expect(toMemberActionCopy({ member: driver, action: 'DEACTIVATE' }).description).toContain(
			'entrega frustrada'
		);
	});

	it('should use the matching confirmation label', () => {
		expect(toMemberActionCopy({ member: driver, action: 'PROMOTE' }).confirmLabel).toBe(
			'Tornar dono'
		);
		expect(
			toMemberActionCopy({ member: { ...driver, role: 'OWNER' }, action: 'DEMOTE' }).confirmLabel
		).toBe('Tornar entregador');
	});
});
