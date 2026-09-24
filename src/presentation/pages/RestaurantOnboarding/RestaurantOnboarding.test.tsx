import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { apiUrl } from 'tests/apiUrl';
import { buildRestaurant } from 'tests/fixtures/restaurants';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { describe, expect, it } from 'vitest';
import { RestaurantOnboarding } from './RestaurantOnboarding';

describe('RestaurantOnboarding', () => {
	it('should fill the address from the zip code and create the restaurant', async () => {
		let payload: unknown;
		server.use(
			http.get('https://viacep.com.br/ws/:zipCode/json/', () =>
				HttpResponse.json({
					cep: '01310-100',
					logradouro: 'Avenida Paulista',
					complemento: '',
					bairro: 'Bela Vista',
					localidade: 'São Paulo',
					uf: 'SP'
				})
			),
			http.post(apiUrl('/restaurants'), async ({ request }) => {
				payload = await request.json();

				return HttpResponse.json(buildRestaurant({ status: 'DRAFT' }), { status: 201 });
			})
		);
		const { user } = renderSignedIn(<RestaurantOnboarding />);

		await user.type(await screen.findByLabelText('Nome fantasia'), 'Cantina da Nonna');
		await user.type(screen.getByLabelText('Razão social'), 'Cantina da Nonna LTDA');
		await user.type(screen.getByLabelText('CNPJ'), '11222333000181');
		expect(screen.getByLabelText('CNPJ')).toHaveValue('11.222.333/0001-81');
		await user.type(screen.getByLabelText('CEP'), '01310100');

		await waitFor(() => expect(screen.getByLabelText('Rua')).toHaveValue('Avenida Paulista'));
		expect(screen.getByLabelText('Número')).toHaveFocus();

		await user.type(screen.getByLabelText('Número'), '1000');
		await user.click(screen.getByRole('button', { name: 'Concluir cadastro' }));

		expect(
			await screen.findByText('Cantina da Nonna cadastrado. Monte o cardápio para abrir a loja.')
		).toBeInTheDocument();
		expect(payload).toEqual({
			tradeName: 'Cantina da Nonna',
			legalName: 'Cantina da Nonna LTDA',
			cnpj: '11222333000181',
			zipCode: '01310100',
			street: 'Avenida Paulista',
			number: '1000',
			neighborhood: 'Bela Vista',
			city: 'São Paulo',
			state: 'SP'
		});
	});

	it('should warn about an unknown zip code', async () => {
		server.use(
			http.get('https://viacep.com.br/ws/:zipCode/json/', () => HttpResponse.json({ erro: 'true' }))
		);
		const { user } = renderSignedIn(<RestaurantOnboarding />);

		await user.type(await screen.findByLabelText('CEP'), '99999999');

		expect(await screen.findByText('CEP não encontrado')).toBeInTheDocument();
	});

	it('should reject an invalid cnpj', async () => {
		const { user } = renderSignedIn(<RestaurantOnboarding />);

		await user.type(await screen.findByLabelText('CNPJ'), '11222333000182');
		await user.click(screen.getByRole('button', { name: 'Concluir cadastro' }));

		expect(await screen.findByText('CNPJ inválido')).toBeInTheDocument();
	});
});
