import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('presentation/routes/Router', () => ({
	Router() {
		throw new Error('Unexpected failure outside the routes');
	}
}));

afterEach(() => {
	vi.restoreAllMocks();
});

describe('App', () => {
	it('should show the error page when something outside the routes breaks', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		render(<App />);

		expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument();
	});
});
