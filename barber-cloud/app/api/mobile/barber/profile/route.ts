import {
  authenticateMobileAccess,
  mobileAuthJson,
  mobileAuthOptionsResponse,
} from "@/app/_lib/mobile-auth";

import { db } from "@/app/_lib/prisma";

export const runtime = "nodejs";

const SPECIALTIES = [
  "Corte clássico",
  "Degradê",
  "Barba",
  "Sobrancelha",
  "Pigmentação",
  "Selagem",
  "Relaxamento",
  "Luzes",
  "Navalhado",
  "Visagismo",
] as const;

function normalizeString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeSpecialties(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowed = new Set<string>(
    SPECIALTIES,
  );

  return Array.from(
    new Set(
      value
        .filter(
          (item): item is string =>
            typeof item === "string",
        )
        .map((item) => item.trim())
        .filter((item) => allowed.has(item)),
    ),
  );
}

export function OPTIONS() {
  return mobileAuthOptionsResponse();
}

export async function PATCH(
  request: Request,
) {
  const authenticated =
    await authenticateMobileAccess(
      request,
    );

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

  if (
    authenticated.user.role !==
    "BARBER"
  ) {
    return mobileAuthJson(
      {
        code: "FORBIDDEN",
        error:
          "Esta operação é exclusiva para barbeiros.",
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

  const nome = normalizeString(
    body.nome,
  );

  const avatar =
    body.avatar === null
      ? null
      : normalizeString(
          body.avatar,
        );

  const bio = normalizeString(
    body.bio,
  );

  const cidade = normalizeString(
    body.cidade,
  );

  const telefone = normalizeString(
    body.telefone,
  );

  const especialidades =
    normalizeSpecialties(
      body.especialidades,
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
    bio.length < 10 ||
    bio.length > 400
  ) {
    return mobileAuthJson(
      {
        code: "INVALID_BIO",
        error:
          "A bio deve ter entre 10 e 400 caracteres.",
      },
      400,
    );
  }

  if (
    especialidades.length < 1
  ) {
    return mobileAuthJson(
      {
        code: "INVALID_SPECIALTIES",
        error:
          "Selecione pelo menos uma especialidade.",
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
          "Informe uma cidade ou região válida.",
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
    const barber =
      await db.barber.findUnique({
        where: {
          userId:
            authenticated.user.id,
        },
        select: {
          id: true,
        },
      });

    if (!barber) {
      return mobileAuthJson(
        {
          code:
            "BARBER_PROFILE_NOT_FOUND",
          error:
            "Perfil de barbeiro não encontrado.",
        },
        404,
      );
    }

    const updatedBarber =
      await db.barber.update({
        where: {
          id: barber.id,
        },
        data: {
          nome,
          avatar:
            avatar || null,
          bio,
          especialidades,
          cidade,
        },
        select: {
          id: true,
          nome: true,
          avatar: true,
          bio: true,
          especialidades: true,
          cidade: true,
          userId: true,
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
        barber: {
          ...updatedBarber,
          telefone,
        },
      },
    });
  } catch (error) {
    console.error(
      "Falha ao atualizar perfil do barbeiro no aplicativo",
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