import { screen, waitFor, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import type { IProduct } from 'shared/entities/IProduct';
import { restaurantUrl } from 'tests/apiUrl';
import { buildMenuCategory, buildProduct } from 'tests/fixtures/menu';
import { renderSignedIn } from 'tests/render';
import { server } from 'tests/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { Products } from './Products';

const category = buildMenuCategory();
let products: IProduct[];

beforeEach(() => {
	products = [buildProduct()];

	server.use(
		http.get(restaurantUrl('/menu-categories'), () => HttpResponse.json([category])),
		http.get(restaurantUrl('/products'), ({ request }) => {
			const menuCategoryId = new URL(request.url).searchParams.get('menuCategoryId');

			return HttpResponse.json(
				products.filter((product) => product.menuCategoryId === menuCategoryId)
			);
		})
	);
});

describe('Products', () => {
	it('asks for a category before any product', async () => {
		server.use(http.get(restaurantUrl('/menu-categories'), () => HttpResponse.json([])));
		renderSignedIn(<Products />);

		expect(await screen.findByText('Crie uma categoria antes')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /Novo produto/ })).not.toBeInTheDocument();
	});

	it('lists the products of the first category', async () => {
		renderSignedIn(<Products />);

		const row = (await screen.findByText('Lasanha')).closest('tr');

		expect(row).not.toBeNull();
		expect(within(row as HTMLElement).getByText('R$ 39,90')).toBeInTheDocument();
	});

	it('creates a product in the selected category', async () => {
		let payload: unknown;
		server.use(
			http.post(restaurantUrl('/products'), async ({ request }) => {
				payload = await request.json();
				const created = buildProduct({ id: 'product-2', name: 'Nhoque', priceCents: 1590 });
				products = [...products, created];

				return HttpResponse.json(created, { status: 201 });
			})
		);
		const { user } = renderSignedIn(<Products />);

		await user.click(await screen.findByRole('button', { name: /Novo produto/ }));
		const dialog = within(await screen.findByRole('dialog'));
		await user.type(dialog.getByLabelText('Nome'), 'Nhoque');
		await user.type(dialog.getByLabelText('Preço'), '1590');
		await user.click(dialog.getByRole('button', { name: 'Criar produto' }));

		expect(await screen.findByText('Produto criado.')).toBeInTheDocument();
		expect(payload).toEqual({
			menuCategoryId: category.id,
			name: 'Nhoque',
			priceCents: 1590
		});
		expect(await screen.findByText('Nhoque')).toBeInTheDocument();
	});

	it('validates the product form', async () => {
		const { user } = renderSignedIn(<Products />);

		await user.click(await screen.findByRole('button', { name: /Novo produto/ }));
		const dialog = within(await screen.findByRole('dialog'));
		await user.click(dialog.getByRole('button', { name: 'Criar produto' }));

		expect(await dialog.findByText('O nome deve ter ao menos 2 caracteres')).toBeInTheDocument();
		expect(dialog.getByText('Informe o preço do produto')).toBeInTheDocument();
	});

	it('edits a product keeping its description', async () => {
		let payload: unknown;
		server.use(
			http.patch(restaurantUrl('/products/product-1'), async ({ request }) => {
				payload = await request.json();

				return HttpResponse.json(products[0]);
			})
		);
		const { user } = renderSignedIn(<Products />);

		await user.click(await screen.findByRole('button', { name: 'Editar Lasanha' }));
		const dialog = within(await screen.findByRole('dialog'));
		const price = dialog.getByLabelText('Preço');
		expect(price).toHaveValue('39,90');
		await user.clear(price);
		await user.type(price, '4290');
		await user.click(dialog.getByRole('button', { name: 'Salvar' }));

		expect(await screen.findByText('Produto atualizado.')).toBeInTheDocument();
		expect(payload).toEqual({
			menuCategoryId: category.id,
			name: 'Lasanha',
			description: 'Lasanha à bolonhesa',
			priceCents: 4290,
			imageKey: null
		});
	});

	it('toggles the availability of a product', async () => {
		let payload: unknown;
		server.use(
			http.patch(restaurantUrl('/products/product-1/availability'), async ({ request }) => {
				payload = await request.json();

				return HttpResponse.json({ ...products[0], isAvailable: false });
			})
		);
		const { user } = renderSignedIn(<Products />);

		const toggle = await screen.findByRole('switch', { name: 'Disponibilidade de Lasanha' });
		expect(toggle).toBeChecked();
		await user.click(toggle);

		await waitFor(() => expect(toggle).not.toBeChecked());
		expect(payload).toEqual({ isAvailable: false });
	});

	it('archives a product after confirmation', async () => {
		server.use(
			http.delete(restaurantUrl('/products/product-1'), () => {
				const [archived] = products;
				products = [];

				return HttpResponse.json(archived);
			})
		);
		const { user } = renderSignedIn(<Products />);

		await user.click(await screen.findByRole('button', { name: 'Arquivar Lasanha' }));
		const dialog = within(await screen.findByRole('dialog'));
		await user.click(dialog.getByRole('button', { name: 'Arquivar' }));

		expect(await screen.findByText('Produto arquivado.')).toBeInTheDocument();
		await waitFor(() => expect(screen.queryByText('Lasanha')).not.toBeInTheDocument());
	});
});
