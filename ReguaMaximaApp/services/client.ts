import * as SecureStore from "expo-secure-store";

const API_URL =
  "https://reguamaxima.cotrimdev.com.br";

export type ClientProfilePayload = {
  nome: string;
  avatar: string | null;
  cidade: string;
  telefone: string;
};

type ClientProfileResponse = {
  data?: {
    client: {
      id: string;
      userId: string;
      nome: string | null;
      avatar: string | null;
      cidade: string | null;
      telefone: string;
    };
  };
  code?: string;
  error?: string;
};

export async function updateClientProfile(
  payload: ClientProfilePayload,
) {
  const accessToken =
    await SecureStore.getItemAsync(
      "access_token",
    );

  if (!accessToken) {
    throw new Error(
      "Sua sessão expirou. Entre novamente.",
    );
  }

  const response = await fetch(
    `${API_URL}/api/mobile/client/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        nome: payload.nome.trim(),
        avatar: payload.avatar,
        cidade: payload.cidade.trim(),
        telefone: payload.telefone.trim(),
      }),
    },
  );

  const responseText =
    await response.text();

  console.log(
    "Status perfil cliente:",
    response.status,
  );

  console.log(
    "Resposta perfil cliente:",
    responseText,
  );

  let data: ClientProfileResponse;

  try {
    data = JSON.parse(
      responseText,
    ) as ClientProfileResponse;
  } catch {
    throw new Error(
      `A API respondeu em formato inválido. Status: ${response.status}`,
    );
  }

  if (!response.ok || !data.data) {
    throw new Error(
      data.error ||
        "Não foi possível atualizar seu perfil.",
    );
  }

  return data.data.client;
}