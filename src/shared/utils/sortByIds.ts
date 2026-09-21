export function sortByIds<TItem extends { id: string }>(items: TItem[], ids: string[]): TItem[] {
	return ids.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined);
}
