import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppError } from './AppError';

describe('AppError', () => {
	it('should offer a reload and a way back to the start after a generic error', () => {
		render(<AppError error={new Error('Cannot read properties of undefined')} />);

		expect(screen.getByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Recarregar página' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/');
	});

	it('should ask for a reload when a chunk from an old deploy is gone', () => {
		render(
			<AppError
				error={new TypeError('Failed to fetch dynamically imported module: /assets/x.js')}
			/>
		);

		expect(screen.getByRole('heading', { name: 'O painel foi atualizado' })).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'Voltar ao início' })).not.toBeInTheDocument();
	});
});
