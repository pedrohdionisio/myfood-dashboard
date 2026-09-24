import { describe, expect, it } from 'vitest';
import { readRedirectPath } from './readRedirectPath';

describe('readRedirectPath', () => {
	it('should read the path saved by the signed out redirect', () => {
		expect(readRedirectPath({ from: '/pedidos?x=1' })).toBe('/pedidos?x=1');
	});

	it('should ignore anything else', () => {
		expect(readRedirectPath(null)).toBeNull();
		expect(readRedirectPath({ from: 42 })).toBeNull();
		expect(readRedirectPath('from')).toBeNull();
	});
});
