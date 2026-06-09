import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERRO reset-password:", error)
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    )
  }
}