// app/_actions/searchUsers.ts
"use server"

import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

interface ResultadoBusca {
  id: string
  userId: string
  nome: string
  user: {
    email: string
  }
}

export async function searchUsers(
  query: string,
  barbershopId: string,
): Promise<ResultadoBusca[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Não autorizado.")
  }

  if (!query || query.trim().length < 3) return []

  const barbershop = await db.barbershop.findFirst({
    where: {
      id: barbershopId,
      ownerId: session.user.id,
    },
    select: { id: true },
  })

  if (!barbershop) {
    throw new Error("Barbearia não encontrada.")
  }

  const barbeiros = await db.barber.findMany({
    where: {
      OR: [
        { barbershopId: null },
        { barbershopId: { not: barbershop.id } },
      ],
      user: {
        email: {
          contains: query.trim(),
          mode: "insensitive",
        },
      },
    },
    take: 5,
    select: {
      id: true,
      userId: true,
      nome: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  })

  return barbeiros.map((barbeiro) => ({
    id: barbeiro.id,
    userId: barbeiro.userId,
    nome: barbeiro.nome ?? "Sem nome",
    user: {
      email: barbeiro.user.email ?? "",
    },
  }))
}
