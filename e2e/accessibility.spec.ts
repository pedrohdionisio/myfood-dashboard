import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { buildMenuCategory, buildProduct } from '../tests/fixtures/menu';
import { buildOrder } from '../tests/fixtures/orders';
import { mockApi, seedSession } from './support/mockApi';

async function expectNoViolations(page: Page) {
	const { violations } = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();

	expect(
		violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))
	).toEqual([]);
}

const signedOutPaths = ['/login', '/cadastro', '/esqueci-a-senha', '/endereco-que-nao-existe'];

const signedInPages = [
	{ path: '/', heading: 'Olá, Pedro' },
	{ path: '/pedidos', heading: 'Pedidos' },
	{ path: '/pedidos/historico', heading: 'Histórico de pedidos' },
	{ path: '/avaliacoes', heading: 'Avaliações' },
	{ path: '/cardapio/categorias', heading: 'Categorias' },
	{ path: '/cardapio/produtos', heading: 'Produtos' },
	{ path: '/equipe', heading: 'Equipe' },
	{ path: '/configuracoes', heading: 'Configurações' }
];

for (const path of signedOutPaths) {
	test(`should have no accessibility violations on ${path}`, async ({ page }) => {
		await mockApi(page);

		await page.goto(path);
		await page.getByRole('heading', { level: 1 }).first().waitFor();

		await expectNoViolations(page);
	});
}

for (const { path, heading } of signedInPages) {
	test(`should have no accessibility violations on ${path} when signed in`, async ({ page }) => {
		const menuCategory = buildMenuCategory();
		await mockApi(page, {
			orders: [buildOrder()],
			menuCategories: [menuCategory],
			products: [buildProduct({ menuCategoryId: menuCategory.id })]
		});
		await seedSession(page);

		await page.goto(path);
		await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();

		await expectNoViolations(page);
	});
}

test('should have no accessibility violations on the order details', async ({ page }) => {
	await mockApi(page, { orders: [buildOrder()] });
	await seedSession(page);

	await page.goto('/pedidos');
	await page.getByRole('button', { name: /#101/ }).click();
	await expect(page.getByRole('dialog')).toBeVisible();

	await expectNoViolations(page);
});
