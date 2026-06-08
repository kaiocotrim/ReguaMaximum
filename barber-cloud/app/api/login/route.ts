import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Preencha email e senha" },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 400 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password!)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    )
  }
}