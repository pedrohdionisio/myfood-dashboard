import { screen, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import type { IMenuCategory } from 'shared/entities/IMenuCategory';
import { restaurantUrl } from 'tests/apiUrl';
import { buildMenuCategory } from 'tests/fixtures/menu';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { describe, expect, it } from 'vitest';
import { MenuCategories } from './MenuCategories';

describe('MenuCategories', () => {
	it('creates a category', async () => {
		let categories: IMenuCategory[] = [];
		let payload: unknown;
		server.use(
			http.get(restaurantUrl('/menu-categories'), () => HttpResponse.json(categories)),
			http.post(restaurantUrl('/menu-categories'), async ({ request }) => {
				payload = await request.json();
				categories = [buildMenuCategory({ name: 'Bebidas' })];

				return HttpResponse.json(categories[0], { status: 201 });
			})
		);
		const { user } = renderSignedIn(<MenuCategories />);

		await user.click(await screen.findByRole('button', { name: /Nova categoria/ }));
		const dialog = within(await screen.findByRole('dialog'));
		await user.type(dialog.getByLabelText('Nome'), '  Bebidas ');
		await user.click(dialog.getByRole('button', { name: 'Criar categoria' }));

		expect(await screen.findByText('Categoria criada.')).toBeInTheDocument();
		expect(payload).toEqual({ name: 'Bebidas' });
		expect(await screen.findByText('Bebidas')).toBeInTheDocument();
	});
});
