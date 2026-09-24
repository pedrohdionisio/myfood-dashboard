import { screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { restaurantUrl } from 'tests/apiUrl';
import { buildOrder, buildOrdersPage } from 'tests/fixtures/orders';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { describe, expect, it } from 'vitest';
import { OrdersHistory } from './OrdersHistory';

describe('OrdersHistory', () => {
	it('should filter by status and restart on the first page', async () => {
		const requests: string[] = [];
		server.use(
			http.get(restaurantUrl('/orders'), ({ request }) => {
				const params = new URL(request.url).searchParams;
				requests.push(params.toString());

				return HttpResponse.json(
					buildOrdersPage([buildOrder({ status: 'DELIVERED' })], {
						hasMore: params.get('page') === '1'
					})
				);
			})
		);
		const { user } = renderSignedIn(<OrdersHistory />);

		expect(await screen.findByText('Entregue')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Ir para a próxima página' }));
		expect(await screen.findByText('Página 2')).toBeInTheDocument();

		await user.click(screen.getByRole('combobox', { name: 'Status' }));
		await user.click(await screen.findByRole('option', { name: 'Cancelado' }));

		expect(await screen.findByText('Página 1')).toBeInTheDocument();
		expect(requests).toEqual([
			'page=1&perPage=20',
			'page=2&perPage=20',
			'status=CANCELED&page=1&perPage=20'
		]);
	});
});
