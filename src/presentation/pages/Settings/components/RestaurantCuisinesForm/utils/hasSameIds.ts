export function hasSameIds(first: string[], second: string[]) {
	if (first.length !== second.length) {
		return false;
	}

	const secondIds = new Set(second);

	return first.every((id) => secondIds.has(id));
}
