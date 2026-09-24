import { describe, expect, it } from 'vitest';
import { sortByIds } from './sortByIds';

describe('sortByIds', () => {
	it('orders items following the ids and drops unknown ids', () => {
		const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

		expect(sortByIds(items, ['c', 'x', 'a'])).toEqual([{ id: 'c' }, { id: 'a' }]);
	});
});
