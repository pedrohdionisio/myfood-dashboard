import { describe, expect, it } from 'vitest';
import { truncateProductName } from './truncateProductName';

describe('truncateProductName', () => {
	it('keeps short names and truncates long ones with an ellipsis', () => {
		expect(truncateProductName('Lasanha')).toBe('Lasanha');
		expect(truncateProductName('Pizza grande de calabresa com borda')).toBe(
			'Pizza grande de calab…'
		);
	});
});
