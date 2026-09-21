export function toStatDelta(current: number, previous: number): number | null {
	if (previous === 0) {
		return null;
	}

	return Math.round(((current - previous) / previous) * 100);
}
