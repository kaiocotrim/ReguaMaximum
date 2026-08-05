import {
  authenticateMobileAccess,
  mobileAuthJson,
  mobileAuthOptionsResponse,
} from "@/app/_lib/mobile-auth"
import { consumeRateLimit, getClientIp } from "@/app/_lib/server-rate-limit"

export const runtime = "nodejs"

export function OPTIONS() {
  return mobileAuthOptionsResponse()
}

export async function GET(request: Request) {
  const rateLimit = consumeRateLimit({
    namespace: "mobile-auth-session-ip",
    identifier: getClientIp(request.headers),
    limit: 120,
    windowMs: 15 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return mobileAuthJson(
      {
        code: "RATE_LIMITED",
        error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    )
  }

  try {
    const session = await authenticateMobileAccess(request)

    if (!session.ok) {
      return mobileAuthJson(
        session.reason === "PROFILE_REQUIRED"
          ? {
              code: "PROFILE_REQUIRED",
              error:
                "Sua conta ainda não possui um perfil. Conclua o cadastro antes de entrar no aplicativo.",
            }
          : {
              code: "INVALID_SESSION",
              error: "Sua sessão expirou. Entre novamente.",
            },
        session.reason === "PROFILE_REQUIRED" ? 403 : 401,
      )
    }

    return mobileAuthJson({ data: { user: session.user } })
  } catch (error) {
    console.error("Falha ao validar sessão do aplicativo", {
      name: error instanceof Error ? error.name : "UnknownError",
    })
    return mobileAuthJson(
      {
        code: "AUTH_UNAVAILABLE",
        error: "Não foi possível validar a sessão. Tente novamente.",
      },
      500,
    )
  }
}
