export function readRecoveryEmail(state: unknown): string | null {
	if (typeof state !== 'object' || state === null || !('email' in state)) {
		return null;
	}

	const { email } = state;

	return typeof email === 'string' ? email : null;
}
