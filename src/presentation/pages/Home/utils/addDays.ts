export function addDays(isoDate: string, days: number): string {
	const shifted = new Date(`${isoDate}T00:00:00Z`);

	shifted.setUTCDate(shifted.getUTCDate() + days);

	return shifted.toISOString().slice(0, 10);
}
