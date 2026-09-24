import { expect, test } from '@playwright/test';
import { buildMembership, buildRestaurant } from '../tests/fixtures/restaurants';
import { mockApi, seedSession } from './support/mockApi';

test('should build the menu, set opening hours and publish the restaurant', async ({ page }) => {
	const state = await mockApi(page, {
		memberships: [buildMembership({ restaurantStatus: 'DRAFT' })],
		restaurant: buildRestaurant({ status: 'DRAFT' })
	});
	await seedSession(page);

	await page.goto('/cardapio/categorias');
	await page.getByRole('button', { name: 'Nova categoria' }).click();
	await page.getByRole('dialog').getByLabel('Nome').fill('Massas');
	await page.getByRole('button', { name: 'Criar categoria' }).click();
	await expect(page.getByText('Categoria criada.')).toBeVisible();

	await page.getByRole('link', { name: 'Produtos', exact: true }).click();
	await page.getByRole('button', { name: 'Novo produto' }).click();

	const dialog = page.getByRole('dialog');
	await dialog.locator('input[type="file"]').setInputFiles('e2e/fixtures/photo.png');
	await dialog.getByRole('button', { name: 'Cortar' }).click();
	await expect(dialog.getByRole('button', { name: 'Criar produto' })).toBeEnabled();
	await dialog.getByLabel('Nome').fill('Lasanha');
	await dialog.getByLabel('Preço').fill('3990');
	await dialog.getByRole('button', { name: 'Criar produto' }).click();

	await expect(page.getByText('Produto criado.')).toBeVisible();
	expect(state.storageUploads).toHaveLength(1);
	expect(state.storageUploads[0]?.fileContentType).toMatch(/^image\/(webp|jpeg)$/);
	expect(state.storageUploads[0]?.declaredContentType).toBe(
		state.storageUploads[0]?.fileContentType
	);

	await page.getByRole('link', { name: 'Configurações', exact: true }).click();
	await page.getByRole('switch', { name: 'Segunda-feira' }).click();
	await page.getByRole('button', { name: 'Salvar horários' }).click();
	await expect(page.getByText('Horários de funcionamento atualizados.')).toBeVisible();

	await page.getByRole('link', { name: 'Visão geral' }).click();
	await page.getByRole('button', { name: 'Publicar restaurante' }).click();

	await expect(
		page.getByText('Restaurante publicado. Sua loja já aparece para os clientes.')
	).toBeVisible();
	await expect(page.getByRole('combobox', { name: 'Período' })).toBeVisible();
});
