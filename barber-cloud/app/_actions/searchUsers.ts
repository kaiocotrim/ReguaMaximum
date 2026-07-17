// app/_actions/searchUsers.ts
"use server"

import { db } from "@/app/_lib/prisma"

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
  if (!query || query.trim().length < 3) return []

  // Busca usuários pelo e-mail, excluindo quem já é barbeiro dessa barbearia
  const usuarios = await db.user.findMany({
    where: {
      email: {
        contains: query.trim(),
        mode: "insensitive",
      },
      barber: {
        none: {
          barbershopId,
        },
      },
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  return usuarios.map((usuario) => ({
    id: usuario.id,
    userId: usuario.id,
    nome: usuario.name ?? "Sem nome",
    user: {
      email: usuario.email ?? "",
    },
  }))
}