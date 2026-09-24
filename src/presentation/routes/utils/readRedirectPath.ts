export function readRedirectPath(state: unknown): string | null {
	if (typeof state !== 'object' || state === null || !('from' in state)) {
		return null;
	}

	const { from } = state;

	return typeof from === 'string' ? from : null;
}
