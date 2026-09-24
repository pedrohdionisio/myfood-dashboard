import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppError } from './AppError';

function BrokenPage(): never {
	throw new Error('Cannot read properties of undefined');
}

function renderRoute(route: Parameters<typeof createMemoryRouter>[0][number]) {
	const router = createMemoryRouter([{ ErrorBoundary: AppError, children: [route] }]);

	return { user: userEvent.setup(), ...render(<RouterProvider router={router} />) };
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('AppError', () => {
	it('should replace a broken page with a way back to the start', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		renderRoute({ path: '/', Component: BrokenPage });

		expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
		expect(screen.getByRole('button', { name: 'Recarregar página' })).toBeInTheDocument();
	});

	it('should ask for a reload when a route chunk from an old deploy is gone', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		renderRoute({
			path: '/',
			lazy: () =>
				Promise.reject(new TypeError('Failed to fetch dynamically imported module: /assets/x.js'))
		});

		expect(
			await screen.findByRole('heading', { name: 'O painel foi atualizado' })
		).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Voltar ao início' })).not.toBeInTheDocument();
	});
});
