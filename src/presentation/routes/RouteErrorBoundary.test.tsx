import { render, screen, waitFor } from '@testing-library/react';
import { Monitoring } from 'data/libs/Monitoring';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RouteErrorBoundary } from './RouteErrorBoundary';

const renderError = new Error('Cannot read properties of undefined');

function BrokenPage(): never {
	throw renderError;
}

function renderRoute(route: Parameters<typeof createMemoryRouter>[0][number]) {
	const router = createMemoryRouter([{ ErrorBoundary: RouteErrorBoundary, children: [route] }]);

	return render(<RouterProvider router={router} />);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('RouteErrorBoundary', () => {
	it('should show the error page and report a broken page', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const captureException = vi.spyOn(Monitoring, 'captureException');
		renderRoute({ path: '/', Component: BrokenPage });

		expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument();
		await waitFor(() => expect(captureException).toHaveBeenCalledWith(renderError));
	});

	it('should show the new version notice when a lazy route fails to load', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		renderRoute({
			path: '/',
			lazy: () =>
				Promise.reject(new TypeError('Failed to fetch dynamically imported module: /assets/x.js'))
		});

		expect(
			await screen.findByRole('heading', { name: 'O painel foi atualizado' })
		).toBeInTheDocument();
	});
});
