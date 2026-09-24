import { describe, expect, it } from 'vitest';
import { isChunkLoadError } from './isChunkLoadError';

describe('isChunkLoadError', () => {
	it('should recognize a failed route chunk in chromium, firefox and safari', () => {
		expect(
			isChunkLoadError(
				new TypeError('Failed to fetch dynamically imported module: /assets/Home-a1b2.js')
			)
		).toBe(true);
		expect(isChunkLoadError(new TypeError('error loading dynamically imported module'))).toBe(true);
		expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true);
	});

	it('should not treat other errors as a new version', () => {
		expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
		expect(isChunkLoadError('dynamically imported module')).toBe(false);
	});
});
