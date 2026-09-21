export function formatOrderTime(isoDate: string): string {
	return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
