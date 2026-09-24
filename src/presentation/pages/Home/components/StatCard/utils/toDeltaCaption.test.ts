import { describe, expect, it } from 'vitest';
import { toDeltaCaption } from './toDeltaCaption';

describe('toDeltaCaption', () => {
	it('should describe the change against the previous period', () => {
		expect(toDeltaCaption(null)).toBe('sem base de comparação');
		expect(toDeltaCaption(0)).toBe('estável vs. período anterior');
		expect(toDeltaCaption(-12)).toBe('12% vs. período anterior');
	});
});
