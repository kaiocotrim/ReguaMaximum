import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos" },
        { status: 400 },
      )
    }

    const userExists = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      return NextResponse.json(
        { error: "Usuário já cadastrado" },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // SUCESSO
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)

    // ERRO
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 },
    )
  }
}