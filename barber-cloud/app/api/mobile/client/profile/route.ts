import {
  authenticateMobileAccess,
  mobileAuthJson,
  mobileAuthOptionsResponse,
} from "@/app/_lib/mobile-auth";

import { db } from "@/app/_lib/prisma";

export const runtime = "nodejs";

function normalizeString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export function OPTIONS() {
  return mobileAuthOptionsResponse();
}

export async function PATCH(request: Request) {
  const authenticated =
    await authenticateMobileAccess(request);

  if (!authenticated.ok) {
    return mobileAuthJson(
      {
        code: "UNAUTHORIZED",
        error:
          "Sua sessão expirou. Entre novamente.",
      },
      401,
    );
  }

  if (authenticated.user.role !== "CLIENT") {
    return mobileAuthJson(
      {
        code: "FORBIDDEN",
        error:
          "Esta operação é exclusiva para clientes.",
      },
      403,
    );
  }

  let body: Record<string, unknown>;

  try {
    body =
      (await request.json()) as Record<
        string,
        unknown
      >;
  } catch {
    return mobileAuthJson(
      {
        code: "INVALID_REQUEST",
        error:
          "Dados de perfil inválidos.",
      },
      400,
    );
  }

  const nome = normalizeString(body.nome);

  const avatar =
    body.avatar === null
      ? null
      : normalizeString(body.avatar);

  const cidade = normalizeString(body.cidade);

  const telefone = normalizeString(
    body.telefone,
  );

  if (
    nome.length < 2 ||
    nome.length > 80
  ) {
    return mobileAuthJson(
      {
        code: "INVALID_NAME",
        error:
          "O nome deve ter entre 2 e 80 caracteres.",
      },
      400,
    );
  }

  if (
    cidade.length < 2 ||
    cidade.length > 100
  ) {
    return mobileAuthJson(
      {
        code: "INVALID_CITY",
        error:
          "Informe uma cidade válida.",
      },
      400,
    );
  }

  if (
    telefone.length < 8 ||
    telefone.length > 30
  ) {
    return mobileAuthJson(
      {
        code: "INVALID_PHONE",
        error:
          "Informe um telefone válido.",
      },
      400,
    );
  }

  try {
    const client =
      await db.client.findUnique({
        where: {
          userId:
            authenticated.user.id,
        },
        select: {
          id: true,
        },
      });

    if (!client) {
      return mobileAuthJson(
        {
          code:
            "CLIENT_PROFILE_NOT_FOUND",
          error:
            "Perfil de cliente não encontrado.",
        },
        404,
      );
    }

    const updatedClient =
      await db.client.update({
        where: {
          id: client.id,
        },
        data: {
          nome,
          avatar: avatar || null,
          cidade,
        },
        select: {
          id: true,
          userId: true,
          nome: true,
          avatar: true,
          cidade: true,
        },
      });

    await db.user.update({
      where: {
        id:
          authenticated.user.id,
      },
      data: {
        name: nome,
        telefone,
      },
    });

    return mobileAuthJson({
      data: {
        client: {
          ...updatedClient,
          telefone,
        },
      },
    });
  } catch (error) {
    console.error(
      "Falha ao atualizar perfil do cliente no aplicativo",
      {
        name:
          error instanceof Error
            ? error.name
            : "UnknownError",
      },
    );

    return mobileAuthJson(
      {
        code:
          "PROFILE_UPDATE_UNAVAILABLE",
        error:
          "Não foi possível atualizar o perfil. Tente novamente.",
      },
      500,
    );
  }
}