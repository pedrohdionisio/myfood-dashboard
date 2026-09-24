import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { AUTH_TOKENS_STORAGE_KEY } from 'shared/constants/storage';
import { apiUrl } from 'tests/apiUrl';
import { buildMembership } from 'tests/fixtures/restaurants';
import { buildUser } from 'tests/fixtures/users';
import { renderApp, seedSession } from 'tests/render';
import { server } from 'tests/server';
import { describe, expect, it } from 'vitest';

function mockSignIn() {
	server.use(
		http.post(apiUrl('/auth/restaurant-users/sign-in'), () =>
			HttpResponse.json({
				user: buildUser(),
				session: {
					accessToken: 'access-token',
					idToken: 'id-token',
					refreshToken: 'refresh-token',
					expiresIn: 3600
				}
			})
		)
	);
}

async function signIn(user: ReturnType<typeof renderApp>['user']) {
	await user.type(await screen.findByLabelText('E-mail'), 'pedro@myfood.com');
	await user.type(screen.getByLabelText('Senha'), 'Senha123');
	await user.click(screen.getByRole('button', { name: 'Fazer Login' }));
}

describe('Router', () => {
	it('signs in and lands on the dashboard, saving the tokens', async () => {
		mockSignIn();
		const { user } = renderApp('/login');

		await signIn(user);

		expect(await screen.findByRole('heading', { name: 'Olá, Pedro' })).toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem(AUTH_TOKENS_STORAGE_KEY) ?? '{}')).toEqual({
			accessToken: 'access-token',
			refreshToken: 'refresh-token'
		});
	});

	it('shows the api message when the credentials are wrong', async () => {
		server.use(
			http.post(apiUrl('/auth/restaurant-users/sign-in'), () =>
				HttpResponse.json({ message: 'E-mail ou senha inválidos' }, { status: 401 })
			)
		);
		const { user } = renderApp('/login');

		await signIn(user);

		expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument();
		expect(localStorage.getItem(AUTH_TOKENS_STORAGE_KEY)).toBeNull();
	});

	it('validates the form before calling the api', async () => {
		const { user } = renderApp('/login');

		await user.click(await screen.findByRole('button', { name: 'Fazer Login' }));

		expect(await screen.findByText('Formato de e-mail inválido')).toBeInTheDocument();
		expect(screen.getByText('Informe sua senha')).toBeInTheDocument();
	});

	it('returns to the requested page after signing in', async () => {
		mockSignIn();
		const { user } = renderApp('/pedidos');

		await signIn(user);

		expect(await screen.findByRole('heading', { name: 'Pedidos' })).toBeInTheDocument();
		expect(window.location.pathname).toBe('/pedidos');
	});

	it('restores a stored session', async () => {
		seedSession();
		renderApp('/');

		expect(await screen.findByRole('heading', { name: 'Olá, Pedro' })).toBeInTheDocument();
	});

	it('renews an expired access token and retries the request', async () => {
		seedSession();
		let meCalls = 0;
		server.use(
			http.get(apiUrl('/restaurant-users/me'), ({ request }) => {
				meCalls += 1;

				if (request.headers.get('Authorization') !== 'Bearer renewed-token') {
					return new HttpResponse(null, { status: 401 });
				}

				return HttpResponse.json(buildUser());
			}),
			http.post(apiUrl('/auth/restaurant-users/refresh'), () =>
				HttpResponse.json({ accessToken: 'renewed-token', idToken: 'id', expiresIn: 3600 })
			)
		);
		renderApp('/');

		expect(await screen.findByRole('heading', { name: 'Olá, Pedro' })).toBeInTheDocument();
		expect(meCalls).toBe(2);
		expect(JSON.parse(localStorage.getItem(AUTH_TOKENS_STORAGE_KEY) ?? '{}').accessToken).toBe(
			'renewed-token'
		);
	});

	it('signs out when the refresh token is rejected', async () => {
		seedSession();
		server.use(
			http.get(apiUrl('/restaurant-users/me'), () => new HttpResponse(null, { status: 401 })),
			http.post(apiUrl('/auth/restaurant-users/refresh'), () =>
				HttpResponse.json({ message: 'Sessão expirada' }, { status: 401 })
			)
		);
		renderApp('/');

		expect(await screen.findByRole('button', { name: 'Fazer Login' })).toBeInTheDocument();
		expect(localStorage.getItem(AUTH_TOKENS_STORAGE_KEY)).toBeNull();
	});

	it('sends an owner without restaurants to the onboarding', async () => {
		seedSession();
		server.use(http.get(apiUrl('/restaurant-users/me/restaurants'), () => HttpResponse.json([])));
		renderApp('/');

		expect(
			await screen.findByRole('heading', { name: 'Cadastre seu restaurante' })
		).toBeInTheDocument();
		expect(window.location.pathname).toBe('/cadastro/restaurante');
	});

	it('tells a driver to use the app instead of the dashboard', async () => {
		seedSession();
		server.use(
			http.get(apiUrl('/restaurant-users/me/restaurants'), () =>
				HttpResponse.json([buildMembership({ role: 'DRIVER' })])
			)
		);
		renderApp('/');

		expect(await screen.findByText(/Suas entregas ficam no app MyFood/)).toBeInTheDocument();
	});

	it('asks which restaurant to manage and remembers the choice', async () => {
		seedSession();
		server.use(
			http.get(apiUrl('/restaurant-users/me/restaurants'), () =>
				HttpResponse.json([
					buildMembership({ restaurantId: 'restaurant-2', tradeName: 'Sushi do Bairro' }),
					buildMembership()
				])
			)
		);
		const { user } = renderApp('/');

		await user.click(await screen.findByRole('button', { name: /Cantina da Nonna/ }));

		expect(await screen.findByRole('heading', { name: 'Olá, Pedro' })).toBeInTheDocument();
		expect(localStorage.getItem('@myfood:selected-restaurant')).toBe('restaurant-1');
	});

	it('signs out from the restaurant selection', async () => {
		seedSession();
		server.use(
			http.get(apiUrl('/restaurant-users/me/restaurants'), () =>
				HttpResponse.json([
					buildMembership({ restaurantId: 'restaurant-2', tradeName: 'Sushi do Bairro' }),
					buildMembership()
				])
			)
		);
		const { user } = renderApp('/');

		await user.click(await screen.findByRole('button', { name: 'Sair' }));

		await waitFor(() => expect(localStorage.getItem(AUTH_TOKENS_STORAGE_KEY)).toBeNull());
		expect(await screen.findByRole('button', { name: 'Fazer Login' })).toBeInTheDocument();
	});
});
