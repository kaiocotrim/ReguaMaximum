import { normalizeEmail } from "@/app/_lib/auth-security"
import { verifyPasswordCredentials } from "@/app/_lib/credentials-auth"
import {
  issueMobileSession,
  mobileAuthJson,
  mobileAuthOptionsResponse,
} from "@/app/_lib/mobile-auth"
import { consumeRateLimit, getClientIp } from "@/app/_lib/server-rate-limit"

export const runtime = "nodejs"

const INVALID_CREDENTIALS = {
  code: "INVALID_CREDENTIALS",
  error: "E-mail ou senha inválidos.",
}

const PROFILE_REQUIRED = {
  code: "PROFILE_REQUIRED",
  error:
    "Sua conta ainda não possui um perfil. Conclua o cadastro antes de entrar no aplicativo.",
}

function rateLimitResponse(retryAfterSeconds: number) {
  return mobileAuthJson(
    {
      code: "RATE_LIMITED",
      error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    },
    429,
    { "Retry-After": String(retryAfterSeconds) },
  )
}

export function OPTIONS() {
  return mobileAuthOptionsResponse()
}

export async function POST(request: Request) {
  const ipRateLimit = consumeRateLimit({
    namespace: "mobile-auth-login-ip",
    identifier: getClientIp(request.headers),
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })

  if (!ipRateLimit.allowed) {
    return rateLimitResponse(ipRateLimit.retryAfterSeconds)
  }

  let body: Record<string, unknown> | null = null

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return mobileAuthJson(INVALID_CREDENTIALS, 401)
  }

  const email = normalizeEmail(body?.email)

  if (email) {
    const emailRateLimit = consumeRateLimit({
      namespace: "mobile-auth-login-email",
      identifier: email,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    })

    if (!emailRateLimit.allowed) {
      return rateLimitResponse(emailRateLimit.retryAfterSeconds)
    }
  }

  try {
    const user = await verifyPasswordCredentials(email, body?.password)

    if (!user) {
      return mobileAuthJson(INVALID_CREDENTIALS, 401)
    }

    if (!user.role) {
      return mobileAuthJson(PROFILE_REQUIRED, 403)
    }

    const session = await issueMobileSession(user)

    if (!session.ok) {
      return mobileAuthJson(
        session.reason === "PROFILE_REQUIRED"
          ? PROFILE_REQUIRED
          : INVALID_CREDENTIALS,
        session.reason === "PROFILE_REQUIRED" ? 403 : 401,
      )
    }

    return mobileAuthJson({ data: session.data })
  } catch (error) {
    console.error("Falha ao autenticar no aplicativo", {
      name: error instanceof Error ? error.name : "UnknownError",
    })
    return mobileAuthJson(
      {
        code: "AUTH_UNAVAILABLE",
        error: "Não foi possível entrar. Tente novamente.",
      },
      500,
    )
  }
}
