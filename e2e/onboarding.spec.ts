import { expect, test } from '@playwright/test';
import { mockApi } from './support/mockApi';

test('creates an account and registers the restaurant', async ({ page }) => {
	await mockApi(page);
	await page.route('https://viacep.com.br/**', (route) =>
		route.fulfill({
			json: {
				cep: '01310-100',
				logradouro: 'Avenida Paulista',
				complemento: '',
				bairro: 'Bela Vista',
				localidade: 'São Paulo',
				uf: 'SP'
			}
		})
	);

	await page.goto('/cadastro');
	await page.getByLabel('Nome').fill('Pedro');
	await page.getByLabel('E-mail').fill('pedro@myfood.com');
	await page.getByLabel('Senha', { exact: true }).fill('Senha123');
	await page.getByRole('button', { name: 'Continuar' }).click();

	await expect(page).toHaveURL('/cadastro/restaurante');

	await page.getByLabel('Nome fantasia').fill('Cantina da Nonna');
	await page.getByLabel('Razão social').fill('Cantina da Nonna LTDA');
	await page.getByLabel('CNPJ').fill('11222333000181');
	await page.getByLabel('CEP').fill('01310100');
	await expect(page.getByLabel('Rua')).toHaveValue('Avenida Paulista');
	await page.getByLabel('Número').fill('1000');
	await page.getByRole('button', { name: 'Concluir cadastro' }).click();

	await expect(page.getByRole('heading', { name: 'Olá, Pedro' })).toBeVisible();
	await expect(page.getByText('Seu restaurante ainda não está publicado')).toBeVisible();
});
