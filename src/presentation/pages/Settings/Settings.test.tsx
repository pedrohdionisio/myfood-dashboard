import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import type { IRestaurant } from 'shared/entities/IRestaurant';
import { restaurantUrl } from 'tests/apiUrl';
import { buildRestaurant } from 'tests/fixtures/restaurants';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { Settings } from './Settings';

let restaurant: IRestaurant;
let viaCepCalls: string[];

beforeEach(() => {
	restaurant = buildRestaurant();
	viaCepCalls = [];

	server.use(
		http.get(restaurantUrl(), () => HttpResponse.json(restaurant)),
		http.get('https://viacep.com.br/ws/:zipCode/json/', ({ params }) => {
			viaCepCalls.push(String(params.zipCode));

			return HttpResponse.json({
				cep: '20040-020',
				logradouro: 'Avenida Rio Branco',
				complemento: '',
				bairro: 'Centro',
				localidade: 'Rio de Janeiro',
				uf: 'RJ'
			});
		})
	);
});

describe('Settings', () => {
	it('keeps the saved address and focus when the page opens', async () => {
		renderSignedIn(<Settings />, '/configuracoes');

		expect(await screen.findByLabelText('Rua')).toHaveValue('Avenida Paulista');
		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(viaCepCalls).toEqual([]);
		expect(screen.getByLabelText('Rua')).toHaveValue('Avenida Paulista');
		expect(screen.getByLabelText('Número')).not.toHaveFocus();
		expect(screen.getByRole('button', { name: 'Salvar cadastro' })).toBeDisabled();
	});

	it('fills the address when the user types a new zip code', async () => {
		const { user } = renderSignedIn(<Settings />, '/configuracoes');

		const zipCode = await screen.findByLabelText('CEP');
		await user.clear(zipCode);
		await user.type(zipCode, '20040020');

		await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Avenida Rio Branco'));
		expect(viaCepCalls).toEqual(['20040020']);
		expect(screen.getByLabelText('Cidade')).toHaveValue('Rio de Janeiro');
		expect(screen.getByLabelText('UF')).toHaveValue('RJ');
		expect(screen.getByLabelText('Número')).toHaveFocus();
	});

	it('keeps unsaved profile edits when the store is paused', async () => {
		server.use(
			http.patch(restaurantUrl('/accepting-orders'), () => {
				restaurant = { ...restaurant, isAcceptingOrders: false };

				return HttpResponse.json(restaurant);
			})
		);
		const { user } = renderSignedIn(<Settings />, '/configuracoes');

		const tradeName = await screen.findByLabelText('Nome fantasia');
		await user.clear(tradeName);
		await user.type(tradeName, 'Cantina Nova');
		await user.click(screen.getByRole('switch', { name: 'Receber pedidos' }));

		expect(await screen.findByText('Loja pausada. Novos pedidos não entram.')).toBeInTheDocument();
		expect(screen.getByLabelText('Nome fantasia')).toHaveValue('Cantina Nova');
	});

	it('saves the profile with values converted for the api', async () => {
		let payload: unknown;
		server.use(
			http.patch(restaurantUrl(), async ({ request }) => {
				payload = await request.json();

				return HttpResponse.json({ ...restaurant, deliveryFeeCents: 990 });
			})
		);
		const { user } = renderSignedIn(<Settings />, '/configuracoes');

		const deliveryFee = await screen.findByLabelText('Taxa de entrega');
		await user.clear(deliveryFee);
		await user.type(deliveryFee, '990');
		await user.click(screen.getByRole('button', { name: 'Salvar cadastro' }));

		expect(await screen.findByText('Cadastro atualizado.')).toBeInTheDocument();
		expect(payload).toMatchObject({
			tradeName: 'Cantina da Nonna',
			zipCode: '01310100',
			deliveryFeeCents: 990,
			minOrderCents: 2000,
			avgPrepTimeMin: 30
		});
		expect(screen.getByRole('button', { name: 'Salvar cadastro' })).toBeDisabled();
	});

	it('saves the opening hours of the days marked as open', async () => {
		let payload: unknown;
		server.use(
			http.put(restaurantUrl('/opening-hours'), async ({ request }) => {
				payload = await request.json();

				return HttpResponse.json([
					{ id: 'shift-1', dayOfWeek: 1, opensAt: '11:00', closesAt: '23:00' }
				]);
			})
		);
		const { user } = renderSignedIn(<Settings />, '/configuracoes');

		await user.click(await screen.findByRole('switch', { name: 'Segunda-feira' }));
		await user.click(screen.getByRole('button', { name: 'Salvar horários' }));

		expect(await screen.findByText('Horários de funcionamento atualizados.')).toBeInTheDocument();
		expect(payload).toEqual({
			shifts: [{ dayOfWeek: 1, opensAt: '11:00', closesAt: '23:00' }]
		});
	});
});
