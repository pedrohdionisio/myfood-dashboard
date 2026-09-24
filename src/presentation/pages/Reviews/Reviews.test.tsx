import { screen, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import type { IRestaurantReview } from 'shared/entities/IRestaurantReview';
import { restaurantUrl } from 'tests/apiUrl';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { describe, expect, it } from 'vitest';
import { Reviews } from './Reviews';

function buildReview(overrides: Partial<IRestaurantReview> = {}): IRestaurantReview {
	return {
		id: 'review-1',
		rating: 4,
		comment: 'Chegou quentinho',
		reply: null,
		repliedAt: null,
		createdAt: '2026-09-20T12:00:00.000Z',
		customerName: 'Maria Souza',
		orderId: 'order-1',
		orderDisplayNumber: 101,
		...overrides
	};
}

describe('Reviews', () => {
	it('replies to a review', async () => {
		let review = buildReview();
		let payload: unknown;
		server.use(
			http.get(restaurantUrl('/reviews'), () =>
				HttpResponse.json({ items: [review], page: 1, perPage: 10, hasMore: false })
			),
			http.post(restaurantUrl('/reviews/review-1/reply'), async ({ request }) => {
				payload = await request.json();
				review = { ...review, reply: 'Obrigado, Maria!', repliedAt: '2026-09-21T12:00:00.000Z' };

				return new HttpResponse(null, { status: 204 });
			})
		);
		const { user } = renderSignedIn(<Reviews />);

		expect(await screen.findByLabelText('4 de 5 estrelas')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Responder' }));
		await user.type(screen.getByLabelText('Sua resposta'), 'Obrigado, Maria!');
		await user.click(screen.getByRole('button', { name: 'Publicar resposta' }));

		expect(await screen.findByText('Resposta publicada.')).toBeInTheDocument();
		expect(payload).toEqual({ reply: 'Obrigado, Maria!' });
		expect(await screen.findByText('Obrigado, Maria!')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Responder' })).not.toBeInTheDocument();
	});

	it('pages through the reviews', async () => {
		const requestedPages: string[] = [];
		server.use(
			http.get(restaurantUrl('/reviews'), ({ request }) => {
				const page = new URL(request.url).searchParams.get('page') ?? '1';
				requestedPages.push(page);

				return HttpResponse.json({
					items: [buildReview({ id: `review-${page}`, customerName: `Cliente ${page}` })],
					page: Number(page),
					perPage: 10,
					hasMore: page === '1'
				});
			})
		);
		const { user } = renderSignedIn(<Reviews />);

		expect(await screen.findByText('Cliente 1')).toBeInTheDocument();
		const pagination = within(screen.getByRole('navigation', { name: 'Paginação' }));
		await user.click(pagination.getByRole('button', { name: 'Ir para a próxima página' }));

		expect(await screen.findByText('Cliente 2')).toBeInTheDocument();
		expect(requestedPages).toEqual(['1', '2']);
	});
});
