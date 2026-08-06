import * as SecureStore from "expo-secure-store";

const API_URL = "https://reguamaxima.cotrimdev.com.br";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "CLIENT" | "BARBER" | null;
};

type LoginResponse = {
  token?: string;
  user?: AuthUser;
  error?: string;
};

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<{
  token: string;
  user: AuthUser;
}> {
  const response = await fetch(
    `${API_URL}/api/celular/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    },
  );

  const responseText = await response.text();

  console.log("Status da API:", response.status);
  console.log("Resposta da API:", responseText);

  let data: LoginResponse;

  try {
    data = JSON.parse(responseText) as LoginResponse;
  } catch {
    throw new Error(
      `A API respondeu em formato inválido. Status: ${response.status}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || "Não foi possível entrar.",
    );
  }

  if (!data.token || !data.user) {
    throw new Error(
      "A API não retornou os dados necessários para o login.",
    );
  }

  await SecureStore.setItemAsync(
    "auth_token",
    data.token,
  );

  await SecureStore.setItemAsync(
    "auth_user",
    JSON.stringify(data.user),
  );

  return {
    token: data.token,
    user: data.user,
  };
}

export async function getAuthToken() {
  return SecureStore.getItemAsync("auth_token");
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const storedUser =
    await SecureStore.getItemAsync("auth_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    await SecureStore.deleteItemAsync("auth_user");
    return null;
  }
}

export async function logout() {
  await Promise.all([
    SecureStore.deleteItemAsync("auth_token"),
    SecureStore.deleteItemAsync("auth_user"),
  ]);
}



type ForgotPasswordResponse = {
  message?: string;
  error?: string;
};

export async function requestPasswordReset(
  email: string,
): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();

  const response = await fetch(
    `${API_URL}/api/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
      }),
    },
  );

  const responseText = await response.text();

  console.log("Status esqueci senha:", response.status);
  console.log("Resposta esqueci senha:", responseText);

  let data: ForgotPasswordResponse;

  try {
    data = JSON.parse(responseText) as ForgotPasswordResponse;
  } catch {
    throw new Error(
      `A API respondeu em formato inválido. Status: ${response.status}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Não foi possível solicitar a recuperação de senha.",
    );
  }

  return (
    data.message ||
    "As instruções para redefinir sua senha foram enviadas."
  );
}