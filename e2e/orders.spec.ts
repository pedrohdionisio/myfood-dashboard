import { expect, test } from '@playwright/test';
import { buildOrder } from '../tests/fixtures/orders';
import { mockApi, seedSession } from './support/mockApi';

test('moves an order from new to preparing', async ({ page }) => {
	await mockApi(page, { orders: [buildOrder()] });
	await seedSession(page);

	await page.goto('/pedidos');

	const newColumn = page.locator('section', { has: page.getByRole('heading', { name: 'Novos' }) });
	const preparingColumn = page.locator('section', {
		has: page.getByRole('heading', { name: 'Em preparo' })
	});

	await newColumn.getByRole('button', { name: /#101/ }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Aceitar' }).click();
	await expect(page.getByText('Pedido atualizado.')).toBeVisible();

	await page.getByRole('button', { name: /#101/ }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Pôr em preparo' }).click();

	await expect(preparingColumn.getByRole('button', { name: /#101/ })).toBeVisible();
	await expect(newColumn.getByText('Nenhum pedido aqui.')).toBeVisible();
});

test('announces an order placed while the board is open', async ({ page }) => {
	const state = await mockApi(page);
	await seedSession(page);

	await page.goto('/pedidos');
	await expect(page.getByRole('heading', { name: 'Novos' })).toBeVisible();

	state.orders = [buildOrder({ displayNumber: 205 })];
	state.streamEvents = [
		{
			type: 'ORDER_PLACED',
			orderId: 'order-1',
			displayNumber: 205,
			status: 'PENDING',
			occurredAt: new Date().toISOString()
		}
	];

	await expect(page.getByText('Novo pedido #205')).toBeVisible({ timeout: 10_000 });
	await expect(page.getByRole('button', { name: /#205/ })).toBeVisible();
});
