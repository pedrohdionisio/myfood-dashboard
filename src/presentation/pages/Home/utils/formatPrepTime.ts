export function formatPrepTime(seconds: number): string {
	const minutes = Math.round(seconds / 60);

	if (minutes < 60) {
		return `${minutes} min`;
	}

	return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}`;
}
