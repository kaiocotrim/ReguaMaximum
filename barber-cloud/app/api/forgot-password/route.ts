import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"

import {
  hashResetToken,
  isValidEmail,
  normalizeEmail,
} from "@/app/_lib/auth-security"
import { db } from "@/app/_lib/prisma"
import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit"

const resend = new Resend(process.env.RESEND_API_KEY)
const GENERIC_MESSAGE =
  "Se existir uma conta com esse e-mail, enviaremos as instruções de recuperação."

function genericResponse() {
  const response = NextResponse.json({
    success: true,
    message: GENERIC_MESSAGE,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}

function rateLimitResponse(retryAfterSeconds: number) {
  const response = NextResponse.json(
    { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
    { status: 429 },
  )
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("Retry-After", String(retryAfterSeconds))
  return response
}

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit({
    namespace: "forgot-password",
    identifier: getClientIp(request.headers),
    limit: 5,
    windowMs: 15 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds)
  }

  let email = ""

  try {
    const body = await request.json()
    email = normalizeEmail(body?.email)
  } catch {
    return genericResponse()
  }

  if (!isValidEmail(email)) {
    return genericResponse()
  }

  const emailRateLimit = consumeRateLimit({
    namespace: "forgot-password-email",
    identifier: email,
    limit: 3,
    windowMs: 60 * 60 * 1000,
  })

  if (!emailRateLimit.allowed) {
    return genericResponse()
  }

  try {
    const user = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
      },
    })

    if (!user?.email) {
      return genericResponse()
    }

    const token = randomBytes(32).toString("hex")
    const tokenHash = hashResetToken(token)

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordExpiry: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    try {
      const baseUrl = process.env.NEXTAUTH_URL

      if (!baseUrl) {
        throw new Error("NEXTAUTH_URL não configurada")
      }

      const resetUrl = new URL("/reset-password", baseUrl)
      resetUrl.searchParams.set("token", token)

      const emailResult = await resend.emails.send({
        from: "Equipe ReguaMaxima <equipe@cotrimdev.com.br>",
        to: user.email,
        subject: "Recuperação de senha",
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
            <body style="margin:0;padding:0;background:#0b0b0b;font-family:sans-serif;">
              <div style="max-width:480px;margin:40px auto;background:#111111;border-radius:12px;overflow:hidden;">
                <div style="background:#C3F32C;padding:32px;text-align:center;">
                  <h1 style="margin:0;color:#0b0b0b;font-size:22px;font-weight:800;">
                    Régua Máxima
                  </h1>
                </div>
                <div style="padding:40px 32px;">
                  <h2 style="color:#ffffff;font-size:20px;margin:0 0 12px;">
                    Recuperação de senha
                  </h2>
                  <p style="color:#a3a3a3;font-size:14px;line-height:1.6;margin:0 0 32px;">
                    Recebemos uma solicitação para redefinir a senha da sua conta.
                    Clique no botão abaixo para criar uma nova senha.
                  </p>
                  <a href="${resetUrl.toString()}"
                     style="display:block;background:#C3F32C;color:#0b0b0b;text-decoration:none;text-align:center;padding:14px 24px;border-radius:999px;font-weight:800;font-size:15px;">
                    Redefinir senha
                  </a>
                  <p style="color:#666;font-size:12px;margin:24px 0 0;text-align:center;line-height:1.6;">
                    Se você não solicitou isso, ignore este e-mail.<br />
                    O link expira em <strong style="color:#999;">1 hora</strong>.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      if (emailResult.error) {
        throw new Error("Falha no provedor de e-mail")
      }
    } catch {
      await db.user.updateMany({
        where: {
          id: user.id,
          resetPasswordToken: tokenHash,
        },
        data: {
          resetPasswordToken: null,
          resetPasswordExpiry: null,
        },
      })

      console.error("Falha ao enviar o e-mail de recuperação de senha")
    }
  } catch {
    console.error("Falha ao processar a recuperação de senha")
  }

  return genericResponse()
}
