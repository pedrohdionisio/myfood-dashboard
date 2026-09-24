import { describe, expect, it } from 'vitest';
import { readRecoveryEmail } from './readRecoveryEmail';

describe('readRecoveryEmail', () => {
	it('should read the email passed by the forgot password page', () => {
		expect(readRecoveryEmail({ email: 'pedro@myfood.com' })).toBe('pedro@myfood.com');
		expect(readRecoveryEmail(undefined)).toBeNull();
		expect(readRecoveryEmail({ email: 1 })).toBeNull();
	});
});
