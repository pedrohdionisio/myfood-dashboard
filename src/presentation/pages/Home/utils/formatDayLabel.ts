export function formatDayLabel(isoDate: string): string {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('pt-BR', {
		timeZone: 'UTC',
		day: '2-digit',
		month: '2-digit'
	});
}
