// app/_actions/inviteBarber.ts
"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function inviteBarber(
  userId: string,
  barbershopId: string,
  message: string,
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado")

  const inviterId = session.user.id
  const normalizedMessage = message.trim()

  if (!normalizedMessage) {
    throw new Error("A mensagem do convite é obrigatória")
  }

  if (normalizedMessage.length > 500) {
    throw new Error("A mensagem deve ter no máximo 500 caracteres")
  }

  const barbershop = await db.barbershop.findFirst({
    where: {
      id: barbershopId,
      ownerId: inviterId,
    },
    select: { id: true },
  })

  if (!barbershop) {
    throw new Error("Você não tem permissão para enviar este convite")
  }

  const targetBarber = await db.barber.findUnique({
    where: { userId },
    select: {
      id: true,
      barbershopId: true,
    },
  })

  if (!targetBarber) {
    throw new Error("Perfil de barbeiro não encontrado")
  }

  if (targetBarber.barbershopId === barbershopId) {
    throw new Error("Este barbeiro já faz parte da sua equipe")
  }

  if (targetBarber.barbershopId) {
    throw new Error(
      "Este barbeiro já está vinculado a outra barbearia e não pode receber o convite",
    )
  }

  const pendingInvite = await db.barbershopInvite.findFirst({
    where: {
      inviteeId: userId,
      barbershopId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  })

  if (pendingInvite) {
    throw new Error("Já existe um convite pendente para este barbeiro")
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const invite = await db.barbershopInvite.create({
    data: {
      inviteeId: userId,
      barbershopId,
      inviterId,
      message: normalizedMessage,
      expiresAt,
    },
  })

  return invite
}
