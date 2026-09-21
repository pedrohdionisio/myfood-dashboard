export function formatOrderDateTime(isoDate: string): string {
	return new Date(isoDate).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});
}
