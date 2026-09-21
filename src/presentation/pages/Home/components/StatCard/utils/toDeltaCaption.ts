export function toDeltaCaption(delta: number | null): string {
	if (delta === null) {
		return 'sem base de comparação';
	}

	if (delta === 0) {
		return 'estável vs. período anterior';
	}

	return `${Math.abs(delta)}% vs. período anterior`;
}
