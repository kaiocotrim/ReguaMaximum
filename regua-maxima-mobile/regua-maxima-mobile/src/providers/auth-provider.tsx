import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';

import {
  AuthApiError,
  AuthSession,
  AuthUser,
  getCurrentSession,
  login,
  LoginInput,
  logout,
  refreshAuthSession,
  register,
  RegisterInput,
  requestPasswordReset,
} from '@/services/auth';

const SESSION_STORAGE_KEY = 'regua-maxima.auth-session.v1';

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (input: LoginInput) => Promise<AuthUser>;
  signUp: (input: RegisterInput) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<AuthUser>;
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    (typeof user.image === 'string' || user.image === null) &&
    (user.role === 'CLIENT' || user.role === 'BARBER')
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<AuthSession>;
  return (
    isAuthUser(session.user) &&
    typeof session.accessToken === 'string' &&
    session.accessToken.length > 0 &&
    typeof session.accessTokenExpiresAt === 'string' &&
    typeof session.refreshToken === 'string' &&
    session.refreshToken.length > 0 &&
    typeof session.refreshTokenExpiresAt === 'string'
  );
}

async function readStoredSession() {
  try {
    const raw =
      Platform.OS === 'web'
        ? globalThis.localStorage?.getItem(SESSION_STORAGE_KEY) ?? null
        : await SecureStore.getItemAsync(SESSION_STORAGE_KEY);

    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isAuthSession(parsed)) {
      await deleteStoredSession();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function writeStoredSession(session: AuthSession) {
  const serialized = JSON.stringify(session);

  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(SESSION_STORAGE_KEY, serialized);
    return;
  }

  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, serialized);
}

async function deleteStoredSession() {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}

function isExpired(expiresAt: string, safetyWindowMs = 0) {
  const expiration = Date.parse(expiresAt);
  return !Number.isFinite(expiration) || expiration <= Date.now() + safetyWindowMs;
}

function isUnauthorized(error: unknown) {
  return error instanceof AuthApiError && error.status === 401;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionRef = useRef<AuthSession | null>(null);
  const refreshPromiseRef = useRef<Promise<AuthSession> | null>(null);
  const sessionEpochRef = useRef(0);

  const commitSession = useCallback(async (nextSession: AuthSession | null) => {
    if (!nextSession) {
      sessionRef.current = null;
      setSession(null);

      try {
        await deleteStoredSession();
      } catch {
        // A memória deve ser limpa mesmo se o armazenamento estiver indisponível.
      }
      return;
    }

    await writeStoredSession(nextSession);
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  const invalidateSession = useCallback(async () => {
    sessionEpochRef.current += 1;
    refreshPromiseRef.current = null;
    await commitSession(null);
  }, [commitSession]);

  const renewSession = useCallback(
    async (sourceSession?: AuthSession) => {
      const current = sourceSession ?? sessionRef.current;
      if (!current || isExpired(current.refreshTokenExpiresAt)) {
        throw new AuthApiError('Sua sessão expirou. Entre novamente.', 401);
      }

      if (refreshPromiseRef.current) return refreshPromiseRef.current;

      const epochAtStart = sessionEpochRef.current;
      const refreshTokenAtStart = current.refreshToken;

      const refreshPromise = (async () => {
        const renewed = await refreshAuthSession(current.refreshToken);

        if (
          sessionEpochRef.current !== epochAtStart ||
          sessionRef.current?.refreshToken !== refreshTokenAtStart
        ) {
          void logout(renewed.accessToken, renewed.refreshToken).catch(() => undefined);
          throw new AuthApiError('A sessão foi alterada durante a renovação.', 409);
        }

        await commitSession(renewed);
        return renewed;
      })();

      refreshPromiseRef.current = refreshPromise;
      refreshPromise.then(
        () => {
          if (refreshPromiseRef.current === refreshPromise) refreshPromiseRef.current = null;
        },
        () => {
          if (refreshPromiseRef.current === refreshPromise) refreshPromiseRef.current = null;
        },
      );

      return refreshPromise;
    },
    [commitSession],
  );

  useEffect(() => {
    let active = true;

    async function hydrateSession() {
      try {
        const storedSession = await readStoredSession();

        if (!storedSession) return;

        sessionRef.current = storedSession;

        if (isExpired(storedSession.refreshTokenExpiresAt)) {
          await invalidateSession();
          return;
        }

        try {
          const user = await getCurrentSession(storedSession.accessToken);
          if (active) await commitSession({ ...storedSession, user });
        } catch (error) {
          if (isUnauthorized(error)) {
            try {
              await renewSession(storedSession);
            } catch (refreshError) {
              if (isUnauthorized(refreshError)) {
                await invalidateSession();
              } else if (active) {
                setSession(storedSession);
              }
            }
          } else if (active) {
            setSession(storedSession);
          }
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void hydrateSession();

    return () => {
      active = false;
    };
  }, [commitSession, invalidateSession, renewSession]);

  const signIn = useCallback(
    async (input: LoginInput) => {
      sessionEpochRef.current += 1;
      const epochAtStart = sessionEpochRef.current;
      refreshPromiseRef.current = null;
      const authenticatedSession = await login(input);

      if (sessionEpochRef.current !== epochAtStart) {
        throw new AuthApiError('A tentativa de login foi cancelada.', 409);
      }

      await commitSession(authenticatedSession);
      return authenticatedSession.user;
    },
    [commitSession],
  );

  const signUp = useCallback(
    async (input: RegisterInput) => {
      sessionEpochRef.current += 1;
      const epochAtStart = sessionEpochRef.current;
      refreshPromiseRef.current = null;
      const authenticatedSession = await register(input);

      if (sessionEpochRef.current !== epochAtStart) {
        throw new AuthApiError('A criação da conta foi cancelada.', 409);
      }

      await commitSession(authenticatedSession);
      return authenticatedSession.user;
    },
    [commitSession],
  );

  const signOut = useCallback(async () => {
    const current = sessionRef.current;

    try {
      await invalidateSession();
    } finally {
      if (current) {
        try {
          await logout(current.accessToken, current.refreshToken);
        } catch {
          // A sessão local deve terminar mesmo quando o aparelho estiver offline.
        }
      }
    }
  }, [invalidateSession]);

  const getAccessToken = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) return null;

    if (!isExpired(current.accessTokenExpiresAt, 30_000)) {
      return current.accessToken;
    }

    try {
      const renewed = await renewSession(current);
      return renewed.accessToken;
    } catch (error) {
      if (isUnauthorized(error)) await invalidateSession();
      throw error;
    }
  }, [invalidateSession, renewSession]);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        isAuthenticated: Boolean(session?.user),
        isLoading,
        signIn,
        signUp,
        signOut,
        getAccessToken,
        sendPasswordReset: requestPasswordReset,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
