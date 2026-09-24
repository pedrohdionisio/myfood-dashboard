import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { removeAccessToken, removeSessionHandlers } from 'data/config/api';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './server';

configure({ asyncUtilTimeout: 5000 });

class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}

class IntersectionObserverStub {
	readonly root = null;
	readonly rootMargin = '';
	readonly thresholds = [];
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub);
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
vi.stubGlobal(
	'matchMedia',
	vi.fn((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
);

Element.prototype.scrollIntoView = vi.fn();
Element.prototype.hasPointerCapture = vi.fn(() => false);
Element.prototype.releasePointerCapture = vi.fn();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
	cleanup();
	server.resetHandlers();
	removeAccessToken();
	removeSessionHandlers();
	localStorage.clear();
});

afterAll(() => server.close());
