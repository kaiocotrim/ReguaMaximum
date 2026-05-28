import { db } from "@/app/_lib/prisma"
import { NextResponse } from "next/server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    )
  }

  const { barbershopId } = await req.json()

  const existingFavorite = await db.favoriteBarbershop.findUnique({
    where: {
      userId_barbershopId: {
        userId: session.user.id,
        barbershopId,
      },
    },
  })

  if (existingFavorite) {
    await db.favoriteBarbershop.delete({
      where: {
        userId_barbershopId: {
          userId: session.user.id,
          barbershopId,
        },
      },
    })

    return NextResponse.json({
      favorited: false,
    })
  }

  await db.favoriteBarbershop.create({
    data: {
      userId: session.user.id,
      barbershopId,
    },
  })

  return NextResponse.json({
    favorited: true,
  })
}