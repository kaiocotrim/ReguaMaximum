// import bcrypt from "bcrypt"

// import {
//   getPasswordValidationError,
//   isValidEmail,
//   normalizeEmail,
// } from "@/app/_lib/auth-security"
// import {
//   issueMobileSession,
//   mobileAuthJson,
//   mobileAuthOptionsResponse,
// } from "@/app/_lib/mobile-auth"
// import { db } from "@/app/_lib/prisma"
// import { consumeRateLimit, getClientIp } from "@/app/_lib/server-rate-limit"

// export const runtime = "nodejs"

// const EMAIL_ALREADY_REGISTERED_ERROR =
//   "Este e-mail já está conectado a uma conta. Entre ou recupere sua senha."

// function rateLimitResponse(retryAfterSeconds: number) {
//   return mobileAuthJson(
//     {
//       code: "RATE_LIMITED",
//       error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
//     },
//     429,
//     { "Retry-After": String(retryAfterSeconds) },
//   )
// }

// export function OPTIONS() {
//   return mobileAuthOptionsResponse()
// }

// export async function POST(request: Request) {
//   const ipRateLimit = consumeRateLimit({
//     namespace: "mobile-auth-register-ip",
//     identifier: getClientIp(request.headers),
//     limit: 5,
//     windowMs: 15 * 60 * 1000,
//   })

//   if (!ipRateLimit.allowed) {
//     return rateLimitResponse(ipRateLimit.retryAfterSeconds)
//   }

//   let body: Record<string, unknown>

//   try {
//     body = (await request.json()) as Record<string, unknown>
//   } catch {
//     return mobileAuthJson(
//       { code: "INVALID_REQUEST", error: "Dados de cadastro inválidos." },
//       400,
//     )
//   }

//   const name = typeof body.name === "string" ? body.name.trim() : ""
//   const email = normalizeEmail(body.email)
//   const password = body.password
//   const passwordError = getPasswordValidationError(password)

//   if (name.length < 2 || name.length > 80) {
//     return mobileAuthJson(
//       {
//         code: "INVALID_NAME",
//         error: "O nome deve ter entre 2 e 80 caracteres.",
//       },
//       400,
//     )
//   }

//   if (!isValidEmail(email)) {
//     return mobileAuthJson(
//       {
//         code: "INVALID_EMAIL",
//         error: "Informe um endereço de e-mail válido.",
//       },
//       400,
//     )
//   }

//   if (passwordError || typeof password !== "string") {
//     return mobileAuthJson(
//       {
//         code: "INVALID_PASSWORD",
//         error: passwordError ?? "Informe uma senha válida.",
//       },
//       400,
//     )
//   }

//   const emailRateLimit = consumeRateLimit({
//     namespace: "mobile-auth-register-email",
//     identifier: email,
//     limit: 3,
//     windowMs: 60 * 60 * 1000,
//   })

//   if (!emailRateLimit.allowed) {
//     return rateLimitResponse(emailRateLimit.retryAfterSeconds)
//   }

//   try {
//     const existingUser = await db.user.findFirst({
//       where: {
//         email: {
//           equals: email,
//           mode: "insensitive",
//         },
//       },
//       select: { id: true },
//     })

//     if (existingUser) {
//       return mobileAuthJson(
//         {
//           code: "EMAIL_ALREADY_REGISTERED",
//           error: EMAIL_ALREADY_REGISTERED_ERROR,
//         },
//         409,
//       )
//     }

//     const passwordHash = await bcrypt.hash(password, 12)
//     const user = await db.user.create({
//       data: {
//         name,
//         email,
//         password: passwordHash,
//         role: "CLIENT",
//         client: {
//           create: {
//             nome: name,
//           },
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         image: true,
//         role: true,
//       },
//     })
//     const session = await issueMobileSession({
//       ...user,
//       password: passwordHash,
//     })

//     if (!session.ok) {
//       throw new Error("Não foi possível criar a sessão mobile")
//     }

//     return mobileAuthJson({ data: session.data }, 201)
//   } catch (error) {
//     const duplicateEmail =
//       typeof error === "object" &&
//       error !== null &&
//       "code" in error &&
//       error.code === "P2002"

//     if (!duplicateEmail) {
//       console.error("Falha ao criar conta no aplicativo", {
//         name: error instanceof Error ? error.name : "UnknownError",
//       })
//     }

//     return mobileAuthJson(
//       {
//         code: duplicateEmail
//           ? "EMAIL_ALREADY_REGISTERED"
//           : "REGISTER_UNAVAILABLE",
//         error: duplicateEmail
//           ? EMAIL_ALREADY_REGISTERED_ERROR
//           : "Não foi possível criar a conta. Tente novamente.",
//       },
//       duplicateEmail ? 409 : 500,
//     )
//   }
// }



import bcrypt from "bcrypt";

import {
  getPasswordValidationError,
  isValidEmail,
  normalizeEmail,
} from "@/app/_lib/auth-security";

import {
  issueMobileSession,
  mobileAuthJson,
  mobileAuthOptionsResponse,
} from "@/app/_lib/mobile-auth";

import { db } from "@/app/_lib/prisma";

import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit";

export const runtime = "nodejs";

const EMAIL_ALREADY_REGISTERED_ERROR =
  "Este e-mail já está conectado a uma conta. Entre ou recupere sua senha.";

type MobileRegisterRole = "CLIENT" | "BARBER";

function rateLimitResponse(
  retryAfterSeconds: number,
) {
  return mobileAuthJson(
    {
      code: "RATE_LIMITED",
      error:
        "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    },
    429,
    {
      "Retry-After": String(retryAfterSeconds),
    },
  );
}

export function OPTIONS() {
  return mobileAuthOptionsResponse();
}

export async function POST(request: Request) {
  const ipRateLimit = consumeRateLimit({
    namespace: "mobile-auth-register-ip",
    identifier: getClientIp(request.headers),
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!ipRateLimit.allowed) {
    return rateLimitResponse(
      ipRateLimit.retryAfterSeconds,
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
        error: "Dados de cadastro inválidos.",
      },
      400,
    );
  }

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  const email = normalizeEmail(body.email);

  const password = body.password;

  const role: MobileRegisterRole | null =
    body.role === "CLIENT" ||
    body.role === "BARBER"
      ? body.role
      : null;

  const passwordError =
    getPasswordValidationError(password);

  if (
    name.length < 2 ||
    name.length > 80
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

  if (!isValidEmail(email)) {
    return mobileAuthJson(
      {
        code: "INVALID_EMAIL",
        error:
          "Informe um endereço de e-mail válido.",
      },
      400,
    );
  }

  if (
    passwordError ||
    typeof password !== "string"
  ) {
    return mobileAuthJson(
      {
        code: "INVALID_PASSWORD",
        error:
          passwordError ??
          "Informe uma senha válida.",
      },
      400,
    );
  }

  if (!role) {
    return mobileAuthJson(
      {
        code: "INVALID_ROLE",
        error:
          "Selecione se você é cliente ou barbeiro.",
      },
      400,
    );
  }

  const emailRateLimit =
    consumeRateLimit({
      namespace:
        "mobile-auth-register-email",
      identifier: email,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

  if (!emailRateLimit.allowed) {
    return rateLimitResponse(
      emailRateLimit.retryAfterSeconds,
    );
  }

  try {
    const existingUser =
      await db.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

    if (existingUser) {
      return mobileAuthJson(
        {
          code:
            "EMAIL_ALREADY_REGISTERED",
          error:
            EMAIL_ALREADY_REGISTERED_ERROR,
        },
        409,
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );

    const user =
      await db.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role,

          ...(role === "CLIENT"
            ? {
                client: {
                  create: {
                    nome: name,
                  },
                },
              }
            : {
                barber: {
                  create: {
                    nome: name,
                  },
                },
              }),
        },

        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });

    const session =
      await issueMobileSession({
        ...user,
        password: passwordHash,
      });

    if (!session.ok) {
      throw new Error(
        "Não foi possível criar a sessão mobile",
      );
    }

    return mobileAuthJson(
      {
        data: session.data,
      },
      201,
    );
  } catch (error) {
    const duplicateEmail =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002";

    if (!duplicateEmail) {
      console.error(
        "Falha ao criar conta no aplicativo",
        {
          name:
            error instanceof Error
              ? error.name
              : "UnknownError",
        },
      );
    }

    return mobileAuthJson(
      {
        code: duplicateEmail
          ? "EMAIL_ALREADY_REGISTERED"
          : "REGISTER_UNAVAILABLE",

        error: duplicateEmail
          ? EMAIL_ALREADY_REGISTERED_ERROR
          : "Não foi possível criar a conta. Tente novamente.",
      },
      duplicateEmail ? 409 : 500,
    );
  }
}