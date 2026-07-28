import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

import {
  getPasswordValidationError,
  hashResetToken,
  isValidResetToken,
} from "@/app/_lib/auth-security"
import { db } from "@/app/_lib/prisma"
import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit"

function jsonNoStore(
  body: Record<string, unknown>,
  init?: { status?: number },
) {
  const response = NextResponse.json(body, init)
  response.headers.set("Cache-Control", "no-store")
  return response
}

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    namespace: "reset-password",
    identifier: getClientIp(request.headers),
    limit: 8,
    windowMs: 15 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    const response = jsonNoStore(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      { status: 429 },
    )
    response.headers.set("Retry-After", String(rateLimit.retryAfterSeconds))
    return response
  }

  try {
    const body = await request.json()
    const token = body?.token
    const password = body?.password
    const passwordError = getPasswordValidationError(password)

    if (!isValidResetToken(token)) {
      return jsonNoStore(
        { error: "Token inválido ou expirado" },
        { status: 400 },
      )
    }

    if (passwordError) {
      return jsonNoStore({ error: passwordError }, { status: 400 })
    }

    const tokenHash = hashResetToken(token)
    const now = new Date()
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: tokenHash,
        resetPasswordExpiry: { gt: now },
      },
      select: { id: true },
    })

    if (!user) {
      return jsonNoStore(
        { error: "Token inválido ou expirado" },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const result = await db.user.updateMany({
      where: {
        id: user.id,
        resetPasswordToken: tokenHash,
        resetPasswordExpiry: { gt: new Date() },
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    })

    if (result.count !== 1) {
      return jsonNoStore(
        { error: "Token inválido ou expirado" },
        { status: 400 },
      )
    }

    return jsonNoStore({ success: true })
  } catch {
    console.error("Falha ao redefinir a senha")
    return jsonNoStore(
      { error: "Não foi possível redefinir a senha" },
      { status: 500 },
    )
  }
}
