import { useQueryClient } from '@tanstack/react-query';
import {
	removeAccessToken,
	removeSessionHandlers,
	setAccessToken,
	setSessionHandlers
} from 'data/config/api';
import { AuthTokensManager, type IAuthTokens } from 'data/libs/AuthTokensManager';
import { AuthService } from 'data/modules/auth/services/AuthService';
import type { IAuthSessionResponse } from 'data/modules/auth/types/AuthTypes';
import {
	createContext,
	type PropsWithChildren,
	use,
	useCallback,
	useEffect,
	useState
} from 'react';
import type { IUser } from 'shared/entities/IUser';
import type { IAuthContextValue } from './AuthProviderTypes';

const AuthContext = createContext<IAuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<IUser | null>(null);
	const [isRestoringSession, setIsRestoringSession] = useState(true);
	const queryClient = useQueryClient();

	const signOut = useCallback(() => {
		removeAccessToken();
		removeSessionHandlers();
		AuthTokensManager.clear();
		queryClient.clear();
		setUser(null);
	}, [queryClient]);

	const refreshAccessToken = useCallback(async () => {
		const stored = AuthTokensManager.load();

		if (!stored) {
			signOut();

			throw new Error('Não há refresh token para renovar a sessão');
		}

		try {
			const { accessToken } = await AuthService.refreshToken({
				refreshToken: stored.refreshToken
			});

			setAccessToken(accessToken);
			AuthTokensManager.save({ ...stored, accessToken });
		} catch (error) {
			signOut();

			throw error;
		}
	}, [signOut]);

	const activateSession = useCallback(
		(tokens: IAuthTokens) => {
			AuthTokensManager.save(tokens);
			setAccessToken(tokens.accessToken);
			setSessionHandlers({ refreshAccessToken, signOut });
		},
		[refreshAccessToken, signOut]
	);

	const signIn = useCallback(
		({ user: signedInUser, session }: IAuthSessionResponse) => {
			activateSession({
				accessToken: session.accessToken,
				refreshToken: session.refreshToken
			});

			setUser(signedInUser);
		},
		[activateSession]
	);

	useEffect(() => {
		async function restoreSession() {
			const tokens = AuthTokensManager.load();

			if (tokens) {
				activateSession(tokens);

				const restoredUser = await AuthService.getMe().catch(() => null);

				setUser(restoredUser);
			}

			setIsRestoringSession(false);
		}

		restoreSession();
	}, [activateSession]);

	if (isRestoringSession) {
		return null;
	}

	return (
		<AuthContext.Provider value={{ user, signedIn: !!user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = use(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used whithin AuthProvider');
	}

	return context;
}
