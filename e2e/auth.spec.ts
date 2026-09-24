import { expect, test } from '@playwright/test';
import { mockApi } from './support/mockApi';

test('should sign in and return to the page that was requested', async ({ page }) => {
	await mockApi(page);

	await page.goto('/pedidos');
	await expect(page).toHaveURL('/login');

	await page.getByLabel('E-mail').fill('pedro@myfood.com');
	await page.getByLabel('Senha', { exact: true }).fill('Senha123');
	await page.getByRole('button', { name: 'Fazer Login' }).click();

	await expect(page).toHaveURL('/pedidos');
	await expect(page.getByRole('heading', { name: 'Pedidos' })).toBeVisible();

	await page.getByRole('button', { name: 'Sair' }).click();
	await expect(page.getByRole('button', { name: 'Fazer Login' })).toBeVisible();
});

test('should show the not found page for an unknown address', async ({ page }) => {
	await mockApi(page);

	await page.goto('/endereco-que-nao-existe');

	await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
	await page.getByRole('link', { name: 'Voltar ao início' }).click();
	await expect(page).toHaveURL('/login');
});
