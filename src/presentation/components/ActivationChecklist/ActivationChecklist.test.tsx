import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { apiUrl, restaurantUrl } from 'tests/apiUrl';
import { buildMembership, buildRestaurant, RESTAURANT_ID } from 'tests/fixtures/restaurants';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { describe, expect, it } from 'vitest';
import { ActivationChecklist } from './ActivationChecklist';

describe('ActivationChecklist', () => {
	it('links to what is missing and blocks publishing', async () => {
		renderSignedIn(<ActivationChecklist restaurantId={RESTAURANT_ID} />);

		expect(await screen.findByRole('link', { name: 'Ir para Produtos' })).toHaveAttribute(
			'href',
			'/cardapio/produtos'
		);
		expect(screen.queryByRole('link', { name: 'Ir para Configurações' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Publicar restaurante' })).toBeDisabled();
	});

	it('publishes the restaurant when every requirement is met', async () => {
		let restaurantStatus: 'DRAFT' | 'ACTIVE' = 'DRAFT';
		server.use(
			http.get(restaurantUrl('/activation-checklist'), () =>
				HttpResponse.json({
					isReadyToActivate: true,
					requirements: [
						{ code: 'OPENING_HOURS', isMet: true },
						{ code: 'AVAILABLE_PRODUCT', isMet: true }
					]
				})
			),
			http.get(apiUrl('/restaurant-users/me/restaurants'), () =>
				HttpResponse.json([buildMembership({ restaurantStatus })])
			),
			http.patch(restaurantUrl('/status'), () => {
				restaurantStatus = 'ACTIVE';

				return HttpResponse.json(buildRestaurant({ status: 'ACTIVE' }));
			})
		);
		const { user, queryClient } = renderSignedIn(
			<ActivationChecklist restaurantId={RESTAURANT_ID} />
		);

		await user.click(await screen.findByRole('button', { name: 'Publicar restaurante' }));

		expect(
			await screen.findByText('Restaurante publicado. Sua loja já aparece para os clientes.')
		).toBeInTheDocument();
		await waitFor(() =>
			expect(queryClient.getQueryData(['MY_RESTAURANTS'])).toEqual([
				buildMembership({ restaurantStatus: 'ACTIVE' })
			])
		);
	});
});
