export type AuthRole = 'CLIENT' | 'BARBER';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: AuthRole;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
  confirmPassword: string;
};

type AuthSessionResponse = {
  data?: AuthSession;
  error?: string;
  message?: string;
};

type CurrentSessionResponse = {
  data?: {
    user: AuthUser;
  };
  error?: string;
  message?: string;
};

type MessageResponse = {
  data?: {
    message?: string;
  };
  error?: string;
  message?: string;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

function getApiUrl() {
  if (!apiUrl) {
    throw new AuthApiError('Endereço da API não configurado.', 0);
  }

  return apiUrl;
}

async function readJson<T>(response: Response) {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

function errorMessage(
  body: { error?: string; message?: string },
  fallback: string,
) {
  return body.error?.trim() || body.message?.trim() || fallback;
}

async function postForSession(path: string, input: Record<string, unknown>) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const body = await readJson<AuthSessionResponse>(response);

  if (!response.ok || !body.data) {
    throw new AuthApiError(
      errorMessage(body, 'Não foi possível autenticar. Tente novamente.'),
      response.status,
    );
  }

  return body.data;
}

export function login(input: LoginInput) {
  return postForSession('/api/mobile/auth/login', input);
}

export function register(input: RegisterInput) {
  return postForSession('/api/mobile/auth/register', {
    name: input.name,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword,
  });
}

export function refreshAuthSession(refreshToken: string) {
  return postForSession('/api/mobile/auth/refresh', { refreshToken });
}

export async function getCurrentSession(accessToken: string) {
  const response = await fetch(`${getApiUrl()}/api/mobile/auth/session`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const body = await readJson<CurrentSessionResponse>(response);

  if (!response.ok || !body.data?.user) {
    throw new AuthApiError(
      errorMessage(body, 'Não foi possível validar a sessão.'),
      response.status,
    );
  }

  return body.data.user;
}

export async function logout(accessToken: string, refreshToken: string) {
  const response = await fetch(`${getApiUrl()}/api/mobile/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const body = await readJson<MessageResponse>(response);
    throw new AuthApiError(
      errorMessage(body, 'Não foi possível encerrar a sessão no servidor.'),
      response.status,
    );
  }
}

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${getApiUrl()}/api/forgot-password`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const body = await readJson<MessageResponse>(response);

  if (!response.ok) {
    throw new AuthApiError(
      errorMessage(body, 'Não foi possível solicitar a recuperação da senha.'),
      response.status,
    );
  }

  return (
    body.data?.message ??
    body.message ??
    'Se existir uma conta com esse e-mail, enviaremos as instruções.'
  );
}
