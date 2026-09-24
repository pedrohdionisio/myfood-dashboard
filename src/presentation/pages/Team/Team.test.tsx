import { screen, waitFor, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import type { IRestaurantMember } from 'shared/entities/IRestaurantMember';
import { restaurantUrl } from 'tests/apiUrl';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { Team } from './Team';

let members: IRestaurantMember[];

beforeEach(() => {
	members = [
		{
			id: 'member-owner',
			userId: 'user-1',
			name: 'Pedro',
			email: 'pedro@myfood.com',
			phone: null,
			role: 'OWNER',
			active: true
		},
		{
			id: 'member-driver',
			userId: 'user-2',
			name: 'João',
			email: 'joao@myfood.com',
			phone: null,
			role: 'DRIVER',
			active: true
		}
	];

	server.use(http.get(restaurantUrl('/members'), () => HttpResponse.json(members)));
});

function rowOf(name: string) {
	const row = screen.getByText(name).closest('tr');

	if (!row) {
		throw new Error(`Row ${name} not found`);
	}

	return within(row);
}

describe('Team', () => {
	it('does not offer actions on the signed in member', async () => {
		renderSignedIn(<Team />);

		expect(await screen.findByText('(você)')).toBeInTheDocument();
		expect(rowOf('Pedro').queryByRole('button')).not.toBeInTheDocument();
		expect(rowOf('João').getByRole('button', { name: 'Desativar' })).toBeInTheDocument();
	});

	it('adds a driver', async () => {
		let payload: unknown;
		server.use(
			http.post(restaurantUrl('/members'), async ({ request }) => {
				payload = await request.json();

				return HttpResponse.json({}, { status: 201 });
			})
		);
		const { user } = renderSignedIn(<Team />);

		await user.click(await screen.findByRole('button', { name: /Novo entregador/ }));
		const dialog = within(await screen.findByRole('dialog'));
		await user.type(dialog.getByLabelText('Nome'), 'Ana');
		await user.type(dialog.getByLabelText('E-mail'), 'ana@myfood.com');
		await user.type(dialog.getByLabelText('Senha'), 'Senha123');
		await user.click(dialog.getByRole('button', { name: 'Adicionar entregador' }));

		expect(await screen.findByText('Entregador adicionado.')).toBeInTheDocument();
		expect(payload).toEqual({
			name: 'Ana',
			email: 'ana@myfood.com',
			password: 'Senha123',
			role: 'DRIVER'
		});
	});

	it('deactivates a member after confirmation', async () => {
		let payload: unknown;
		server.use(
			http.patch(restaurantUrl('/members/member-driver'), async ({ request }) => {
				payload = await request.json();
				members = members.map((member) =>
					member.id === 'member-driver' ? { ...member, active: false } : member
				);

				return HttpResponse.json({});
			})
		);
		const { user } = renderSignedIn(<Team />);

		await screen.findByText('João');
		await user.click(rowOf('João').getByRole('button', { name: 'Desativar' }));
		const dialog = within(await screen.findByRole('dialog'));
		await user.click(dialog.getByRole('button', { name: 'Desativar' }));

		expect(await screen.findByText('Acesso desativado.')).toBeInTheDocument();
		expect(payload).toEqual({ active: false });
		await waitFor(() =>
			expect(rowOf('João').getByRole('button', { name: 'Reativar' })).toBeInTheDocument()
		);
	});
});
