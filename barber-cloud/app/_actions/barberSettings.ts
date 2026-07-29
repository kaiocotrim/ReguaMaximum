"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

type WorkScheduleInput = {
  weekday: number
  enabled: boolean
  startTime: string
  endTime: string
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export async function updateBarberSettings(input: {
  barberId: string
  jobTitle: string
  isActive: boolean
  schedules: WorkScheduleInput[]
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Não autenticado.")

  const jobTitle = input.jobTitle.trim()
  if (jobTitle.length < 2 || jobTitle.length > 50) {
    throw new Error("Informe um cargo entre 2 e 50 caracteres.")
  }

  if (
    input.schedules.length !== 7 ||
    new Set(input.schedules.map((schedule) => schedule.weekday)).size !== 7
  ) {
    throw new Error("A jornada semanal está incompleta.")
  }

  for (const schedule of input.schedules) {
    if (
      schedule.weekday < 0 ||
      schedule.weekday > 6 ||
      !TIME_PATTERN.test(schedule.startTime) ||
      !TIME_PATTERN.test(schedule.endTime)
    ) {
      throw new Error("Existe um horário inválido na jornada.")
    }
    if (schedule.enabled && schedule.startTime >= schedule.endTime) {
      throw new Error("O horário de saída deve ser posterior ao de entrada.")
    }
  }

  const barber = await db.barber.findFirst({
    where: {
      id: input.barberId,
      barbershop: { ownerId: session.user.id },
    },
    select: { id: true },
  })
  if (!barber) throw new Error("Funcionário não encontrado nesta barbearia.")

  await db.$transaction([
    db.barber.update({
      where: { id: barber.id },
      data: { jobTitle, isActive: input.isActive },
    }),
    ...input.schedules.map((schedule) =>
      db.barberWorkSchedule.upsert({
        where: {
          barberId_weekday: {
            barberId: barber.id,
            weekday: schedule.weekday,
          },
        },
        create: { barberId: barber.id, ...schedule },
        update: {
          enabled: schedule.enabled,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        },
      }),
    ),
  ])

  revalidatePath("/dashboard/barbeiros")
  revalidatePath("/barbershops")
  return { success: true as const }
}
