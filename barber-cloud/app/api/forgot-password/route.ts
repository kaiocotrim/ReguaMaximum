import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { Resend } from "resend"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    )
  }

  const token = crypto.randomBytes(32).toString("hex")

  await db.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiry: new Date(
        Date.now() + 1000 * 60 * 60 // 1 hora
      ),
    },
  })

const resetLink =
  `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

await resend.emails.send({
  from: "Equipe RegumaMaxima <equipe@cotrimdev.com.br>",
  to: email,
    subject: "Recuperação de senha",
    html: `
    <!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0b;font-family:sans-serif;">

    <div style="max-width:480px;margin:40px auto;background:#111111;border-radius:12px;overflow:hidden;">

      <!-- Header -->
      <div style="background:#C3F32C;padding:32px;text-align:center;">
        <h1 style="margin:0;color:#0b0b0b;font-size:22px;font-weight:800;">
          RegumaMaxima
        </h1>
      </div>

      <!-- Content -->
      <div style="padding:40px 32px;">

        <h2 style="color:#ffffff;font-size:20px;margin:0 0 12px;">
          Recuperação de senha
        </h2>

        <p style="color:#a3a3a3;font-size:14px;line-height:1.6;margin:0 0 32px;">
          Recebemos uma solicitação para redefinir a senha da sua conta.
          Clique no botão abaixo para criar uma nova senha.
        </p>

        <a href="${resetLink}"
           style="display:block;background:#C3F32C;color:#0b0b0b;text-decoration:none;
                  text-align:center;padding:14px 24px;border-radius:999px;
                  font-weight:800;font-size:15px;">
          Redefinir senha
        </a>

        <p style="color:#666;font-size:12px;margin:24px 0 0;text-align:center;line-height:1.6;">
          Se você não solicitou isso, ignore este e-mail.<br/>
          O link expira em <strong style="color:#999;">1 hora</strong>.
        </p>

      </div>

    </div>

  </body>
</html>
    `,
  })

return NextResponse.json({
  success: true,
})
}