import {
  mobileAuthEmptyResponse,
  mobileAuthOptionsResponse,
  revokeMobileAccessSession,
  revokeMobileRefreshToken,
} from "@/app/_lib/mobile-auth"
import { consumeRateLimit, getClientIp } from "@/app/_lib/server-rate-limit"

export const runtime = "nodejs"

export function OPTIONS() {
  return mobileAuthOptionsResponse()
}

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    namespace: "mobile-auth-logout-ip",
    identifier: getClientIp(request.headers),
    limit: 60,
    windowMs: 15 * 60 * 1000,
  })

  if (rateLimit.allowed) {
    let refreshToken: unknown

    try {
      const body = (await request.json()) as Record<string, unknown>
      refreshToken = body.refreshToken
    } catch {
      refreshToken = null
    }

    await Promise.all([
      revokeMobileRefreshToken(refreshToken).catch(() => undefined),
      revokeMobileAccessSession(request).catch(() => undefined),
    ])
  }

  return mobileAuthEmptyResponse()
}
