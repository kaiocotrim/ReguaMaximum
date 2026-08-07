import * as SecureStore from "expo-secure-store";

const API_URL = "https://reguamaxima.cotrimdev.com.br";

export type BarberProfilePayload = {
  nome: string;
  avatar: string | null;
  bio: string;
  especialidades: string[];
  cidade: string;
  telefone: string;
};

type BarberProfileResponse = {
  data?: {
    barber: {
      id: string;
      userId: string;
      nome: string | null;
      avatar: string | null;
      bio: string | null;
      especialidades: string[];
      cidade: string | null;
      telefone: string;
    };
  };
  code?: string;
  error?: string;
};

async function getAccessToken() {
  return SecureStore.getItemAsync("access_token");
}

export async function updateBarberProfile(
  payload: BarberProfilePayload,
) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error(
      "Sua sessão expirou. Entre novamente.",
    );
  }

  const response = await fetch(
    `${API_URL}/api/mobile/barber/profile`,
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
        bio: payload.bio.trim(),
        especialidades: payload.especialidades,
        cidade: payload.cidade.trim(),
        telefone: payload.telefone.trim(),
      }),
    },
  );

  const responseText = await response.text();

  console.log(
    "Status perfil barbeiro:",
    response.status,
  );

  console.log(
    "Resposta perfil barbeiro:",
    responseText,
  );

  let data: BarberProfileResponse;

  try {
    data =
      JSON.parse(
        responseText,
      ) as BarberProfileResponse;
  } catch {
    throw new Error(
      `A API respondeu em formato inválido. Status: ${response.status}`,
    );
  }

  if (!response.ok || !data.data) {
    if (
      data.code === "UNAUTHORIZED"
    ) {
      throw new Error(
        "Sua sessão expirou. Entre novamente.",
      );
    }

    if (
      data.code === "FORBIDDEN"
    ) {
      throw new Error(
        "Esta conta não é de barbeiro.",
      );
    }

    if (
      data.code === "INVALID_NAME"
    ) {
      throw new Error(
        data.error ||
          "Digite um nome válido.",
      );
    }

    if (
      data.code === "INVALID_BIO"
    ) {
      throw new Error(
        data.error ||
          "Digite uma descrição válida.",
      );
    }

    if (
      data.code ===
      "INVALID_SPECIALTIES"
    ) {
      throw new Error(
        data.error ||
          "Selecione pelo menos uma especialidade.",
      );
    }

    if (
      data.code === "INVALID_CITY"
    ) {
      throw new Error(
        data.error ||
          "Digite uma cidade válida.",
      );
    }

    if (
      data.code === "INVALID_PHONE"
    ) {
      throw new Error(
        data.error ||
          "Digite um telefone válido.",
      );
    }

    if (
      data.code ===
      "BARBER_PROFILE_NOT_FOUND"
    ) {
      throw new Error(
        "Seu perfil de barbeiro não foi encontrado.",
      );
    }

    throw new Error(
      data.error ||
        "Não foi possível atualizar seu perfil.",
    );
  }

  return data.data.barber;
}