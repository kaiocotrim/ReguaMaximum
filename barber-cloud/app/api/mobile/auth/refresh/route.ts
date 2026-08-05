import {
  mobileAuthJson,
  mobileAuthOptionsResponse,
  rotateMobileRefreshToken,
} from "@/app/_lib/mobile-auth"
import { consumeRateLimit, getClientIp } from "@/app/_lib/server-rate-limit"

export const runtime = "nodejs"

const INVALID_SESSION = {
  code: "INVALID_SESSION",
  error: "Sua sessão expirou. Entre novamente.",
}

const PROFILE_REQUIRED = {
  code: "PROFILE_REQUIRED",
  error:
    "Sua conta ainda não possui um perfil. Conclua o cadastro antes de entrar no aplicativo.",
}

export function OPTIONS() {
  return mobileAuthOptionsResponse()
}

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    namespace: "mobile-auth-refresh-ip",
    identifier: getClientIp(request.headers),
    limit: 30,
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

  let refreshToken: unknown

  try {
    const body = (await request.json()) as Record<string, unknown>
    refreshToken = body.refreshToken
  } catch {
    return mobileAuthJson(INVALID_SESSION, 401)
  }

  try {
    const session = await rotateMobileRefreshToken(refreshToken)

    if (!session.ok) {
      return mobileAuthJson(
        session.reason === "PROFILE_REQUIRED"
          ? PROFILE_REQUIRED
          : INVALID_SESSION,
        session.reason === "PROFILE_REQUIRED" ? 403 : 401,
      )
    }

    return mobileAuthJson({ data: session.data })
  } catch (error) {
    console.error("Falha ao renovar sessão do aplicativo", {
      name: error instanceof Error ? error.name : "UnknownError",
    })
    return mobileAuthJson(
      {
        code: "AUTH_UNAVAILABLE",
        error: "Não foi possível renovar a sessão. Tente novamente.",
      },
      500,
    )
  }
}
