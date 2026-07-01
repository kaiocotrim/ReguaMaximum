"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { redirect } from "next/navigation"

type CreateBarbershopInput = {
  nome: string
  telefone: string
  cidade: string
  endereco: string
  descricao: string
  tags: string[]
  logo_url: string
  capa_url: string | null
  instagram: string
  horario_abertura: string
  horario_fechamento: string
  cor_marca: string
}

export async function createBarbershop(dados: CreateBarbershopInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "BARBER") {
    throw new Error("Apenas barbeiros podem criar uma barbearia.")
  }

  const barber = await db.barber.findUnique({
    where: { userId: session.user.id },
  })

  if (!barber) throw new Error("Perfil de barbeiro não encontrado.")

  const barbershop = await db.barbershop.create({
    data: {
      name:              dados.nome,
      phones:            [dados.telefone],
      cidade:            dados.cidade,
      address:           dados.endereco,
      description:       dados.descricao || "",
      tags:              dados.tags,
      imageUrl:          dados.logo_url,
      capaUrl:           dados.capa_url,
      instagram:         dados.instagram || null,
      horarioAbertura:   dados.horario_abertura,
      horarioFechamento: dados.horario_fechamento,
      corMarca:          dados.cor_marca,
      ownerId:           barber.id,
      barbers: {
        connect: { id: barber.id },
      },
    },
  })

  redirect("/barbeiro/dashboard")
}