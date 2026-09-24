export function isChunkLoadError(error: unknown): boolean {
	return (
		error instanceof Error &&
		/dynamically imported module|Importing a module script failed/i.test(error.message)
	);
}
