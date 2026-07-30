import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

import {
  getPasswordValidationError,
  isValidEmail,
  normalizeEmail,
} from "@/app/_lib/auth-security"
import { db } from "@/app/_lib/prisma"
import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit"

const EMAIL_ALREADY_REGISTERED_ERROR =
  "Este e-mail já está conectado a uma conta. Entre ou recupere sua senha."

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
    namespace: "register",
    identifier: getClientIp(request.headers),
    limit: 5,
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
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = normalizeEmail(body?.email)
    const password = body?.password
    const passwordError = getPasswordValidationError(password)

    if (name.length < 2 || name.length > 80) {
      return jsonNoStore(
        { error: "O nome deve ter entre 2 e 80 caracteres" },
        { status: 400 },
      )
    }

    if (!isValidEmail(email)) {
      return jsonNoStore(
        { error: "Informe um endereço de e-mail válido" },
        { status: 400 },
      )
    }

    if (passwordError) {
      return jsonNoStore(
        { error: passwordError },
        { status: 400 },
      )
    }

    const userExists = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true },
    })

    if (userExists) {
      return jsonNoStore(
        { error: EMAIL_ALREADY_REGISTERED_ERROR },
        { status: 409 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return jsonNoStore(user, { status: 201 })
  } catch (error) {
    const isDuplicateEmail =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"

    if (!isDuplicateEmail) {
      console.error("Falha ao criar usuário")
    }

    return jsonNoStore(
      {
        error: isDuplicateEmail
          ? EMAIL_ALREADY_REGISTERED_ERROR
          : "Não foi possível criar a conta. Tente novamente.",
      },
      { status: isDuplicateEmail ? 409 : 500 },
    )
  }
}
