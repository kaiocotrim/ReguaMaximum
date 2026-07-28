"use server"

import { db } from "@/app/_lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { sendBookingEmail } from "./send-booking-email"

type BookingInput = {
  barbershopId: string
  serviceId: string
  barberId: string
  date: Date
}

type DayAvailabilityInput = Pick<BookingInput, "barbershopId" | "serviceId"> & {
  date: Date
}

type BarberAvailabilityInput = DayAvailabilityInput & {
  barberId: string
}

type ReservedBooking = {
  id: string
  date: Date
  userEmail: string | null
  userName: string | null
  barbershopName: string
  serviceName: string
  barberName: string | null
}

type BookingWithDuration = {
  barberId: string
  date: Date
  service: { duration: number }
}

const DEFAULT_OPENING_TIME = "08:00"
const DEFAULT_CLOSING_TIME = "19:00"
const SLOT_INTERVAL_MINUTES = 30

function overlaps(
  requestedStart: Date,
  requestedEnd: Date,
  existingStart: Date,
  existingDuration: number,
) {
  const existingEnd = new Date(
    existingStart.getTime() + existingDuration * 60_000,
  )
  return requestedStart < existingEnd && requestedEnd > existingStart
}

function clockToMinutes(value: string | null, fallback: string) {
  const match = (value ?? fallback).match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return clockToMinutes(fallback, fallback)

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return clockToMinutes(fallback, fallback)

  return hours * 60 + minutes
}

function startOfSelectedDay(date: Date) {
  const dayStart = new Date(date)
  if (Number.isNaN(dayStart.getTime())) {
    throw new Error("Data inválida.")
  }
  dayStart.setHours(0, 0, 0, 0)
  return dayStart
}

function createAvailableSlots({
  dayStart,
  openingTime,
  closingTime,
  serviceDuration,
  bookings,
  barberId,
}: {
  dayStart: Date
  openingTime: string | null
  closingTime: string | null
  serviceDuration: number
  bookings: BookingWithDuration[]
  barberId: string
}) {
  const openingMinutes = clockToMinutes(
    openingTime,
    DEFAULT_OPENING_TIME,
  )
  const closingMinutes = clockToMinutes(
    closingTime,
    DEFAULT_CLOSING_TIME,
  )
  const now = Date.now()
  const availableSlots: string[] = []

  for (
    let minutes = openingMinutes;
    minutes + serviceDuration <= closingMinutes;
    minutes += SLOT_INTERVAL_MINUTES
  ) {
    const slotStart = new Date(dayStart.getTime() + minutes * 60_000)
    const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60_000)

    if (slotStart.getTime() <= now) continue

    const hasConflict = bookings.some(
      (booking) =>
        booking.barberId === barberId &&
        overlaps(
          slotStart,
          slotEnd,
          booking.date,
          booking.service.duration,
        ),
    )

    if (!hasConflict) {
      const hours = String(Math.floor(minutes / 60)).padStart(2, "0")
      const mins = String(minutes % 60).padStart(2, "0")
      availableSlots.push(`${hours}:${mins}`)
    }
  }

  return availableSlots
}

async function getDayAvailability(
  tx: typeof db,
  data: DayAvailabilityInput,
) {
  const dayStart = startOfSelectedDay(data.date)
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const [service, barbershop, barbers, longestService] = await Promise.all([
    tx.barbeshopService.findFirst({
      where: { id: data.serviceId, barbershopId: data.barbershopId },
      select: { duration: true },
    }),
    tx.barbershop.findUnique({
      where: { id: data.barbershopId },
      select: { horarioAbertura: true, horarioFechamento: true },
    }),
    tx.barber.findMany({
      where: { barbershopId: data.barbershopId },
      select: { id: true },
    }),
    tx.barbeshopService.aggregate({
      where: { barbershopId: data.barbershopId },
      _max: { duration: true },
    }),
  ])

  if (!service || !barbershop) {
    throw new Error("Serviço ou barbearia não encontrado.")
  }

  const searchStart = new Date(
    dayStart.getTime() -
      (longestService._max.duration ?? service.duration) * 60_000,
  )
  const bookings = await tx.booking.findMany({
    where: {
      barbershopId: data.barbershopId,
      status: { not: "CANCELADO" },
      date: { gte: searchStart, lt: dayEnd },
    },
    select: {
      barberId: true,
      date: true,
      service: { select: { duration: true } },
    },
  })

  const timesByBarber = new Map(
    barbers.map((barber) => [
      barber.id,
      createAvailableSlots({
        dayStart,
        openingTime: barbershop.horarioAbertura,
        closingTime: barbershop.horarioFechamento,
        serviceDuration: service.duration,
        bookings,
        barberId: barber.id,
      }),
    ]),
  )

  return { timesByBarber }
}

async function unavailableBarbers(
  tx: typeof db,
  data: Pick<BookingInput, "barbershopId" | "serviceId" | "date">,
) {
  const service = await tx.barbeshopService.findFirst({
    where: { id: data.serviceId, barbershopId: data.barbershopId },
    select: { duration: true },
  })

  if (!service) {
    throw new Error("Serviço não encontrado nesta barbearia.")
  }

  const requestedStart = new Date(data.date)
  const requestedEnd = new Date(
    requestedStart.getTime() + service.duration * 60_000,
  )
  const longestService = await tx.barbeshopService.aggregate({
    where: { barbershopId: data.barbershopId },
    _max: { duration: true },
  })
  const searchStart = new Date(
    requestedStart.getTime() -
      (longestService._max.duration ?? service.duration) * 60_000,
  )

  const bookings = await tx.booking.findMany({
    where: {
      barbershopId: data.barbershopId,
      status: { not: "CANCELADO" },
      date: { gte: searchStart, lt: requestedEnd },
    },
    select: {
      barberId: true,
      date: true,
      service: { select: { duration: true } },
    },
  })

  return [
    ...new Set(
      bookings
        .filter((booking) =>
          overlaps(
            requestedStart,
            requestedEnd,
            booking.date,
            booking.service.duration,
          ),
        )
        .map((booking) => booking.barberId),
    ),
  ]
}

export async function getAvailableBarberIdsForDate(
  data: DayAvailabilityInput,
) {
  try {
    const { timesByBarber } = await getDayAvailability(db, data)
    const barberIds = [...timesByBarber.entries()]
      .filter(([, times]) => times.length > 0)
      .map(([barberId]) => barberId)

    return { success: true as const, barberIds }
  } catch (error) {
    console.error("Erro ao consultar barbeiros disponíveis:", error)
    return {
      success: false as const,
      barberIds: [] as string[],
      error: "Não foi possível consultar os barbeiros agora.",
    }
  }
}

export async function getAvailableTimesForBarber(
  data: BarberAvailabilityInput,
) {
  try {
    const { timesByBarber } = await getDayAvailability(db, data)
    if (!timesByBarber.has(data.barberId)) {
      return {
        success: false as const,
        times: [] as string[],
        error: "Barbeiro não pertence a esta barbearia.",
      }
    }

    return {
      success: true as const,
      times: timesByBarber.get(data.barberId) ?? [],
    }
  } catch (error) {
    console.error("Erro ao consultar horários disponíveis:", error)
    return {
      success: false as const,
      times: [] as string[],
      error: "Não foi possível consultar os horários agora.",
    }
  }
}

export async function createBooking(data: BookingInput) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false as const, error: "Faça login para agendar." }
  }

  const requestedDate = new Date(data.date)
  if (
    Number.isNaN(requestedDate.getTime()) ||
    requestedDate.getTime() <= Date.now()
  ) {
    return {
      success: false as const,
      error: "Escolha uma data e um horário futuros.",
    }
  }

  try {
    let booking: ReservedBooking | undefined

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        booking = await db.$transaction(
          async (tx) => {
            const barber = await tx.barber.findFirst({
              where: { id: data.barberId, barbershopId: data.barbershopId },
              select: { id: true },
            })
            if (!barber) {
              throw new Error("Barbeiro não pertence a esta barbearia.")
            }

            const dayStart = startOfSelectedDay(requestedDate)
            const requestedMinutes =
              (requestedDate.getTime() - dayStart.getTime()) / 60_000
            const requestedTime =
              Number.isInteger(requestedMinutes) && requestedMinutes >= 0
                ? `${String(Math.floor(requestedMinutes / 60)).padStart(2, "0")}:${String(requestedMinutes % 60).padStart(2, "0")}`
                : ""
            const { timesByBarber } = await getDayAvailability(
              tx as unknown as typeof db,
              {
                barbershopId: data.barbershopId,
                serviceId: data.serviceId,
                date: dayStart,
              },
            )

            if (
              !requestedTime ||
              !timesByBarber.get(data.barberId)?.includes(requestedTime)
            ) {
              throw new Error(
                "Este horário não está mais disponível. Escolha outro horário.",
              )
            }

            const unavailableBarberIds = await unavailableBarbers(
              tx as unknown as typeof db,
              {
                barbershopId: data.barbershopId,
                serviceId: data.serviceId,
                date: requestedDate,
              },
            )
            if (unavailableBarberIds.includes(data.barberId)) {
              throw new Error(
                "Este horário acabou de ser ocupado. Escolha outro horário disponível.",
              )
            }

            const created = await tx.booking.create({
              data: {
                date: requestedDate,
                user: { connect: { id: session.user.id } },
                barbershop: { connect: { id: data.barbershopId } },
                service: { connect: { id: data.serviceId } },
                barber: { connect: { id: data.barberId } },
              },
              select: {
                id: true,
                date: true,
                user: { select: { email: true, name: true } },
                barbershop: { select: { name: true } },
                service: { select: { name: true } },
                barber: {
                  select: {
                    user: { select: { name: true } },
                  },
                },
              },
            })

            return {
              id: created.id,
              date: created.date,
              userEmail: created.user.email,
              userName: created.user.name,
              barbershopName: created.barbershop.name,
              serviceName: created.service.name,
              barberName: created.barber.user.name,
            }
          },
          { isolationLevel: "Serializable" },
        )
        break
      } catch (error) {
        const code = (error as { code?: string }).code
        if (code === "P2034" && attempt === 0) continue
        throw error
      }
    }

    if (!booking) {
      return {
        success: false as const,
        error: "O horário acabou de ser ocupado. Escolha outro horário.",
      }
    }

    try {
      if (booking.userEmail) {
        await sendBookingEmail({
          toEmail: booking.userEmail,
          userName: booking.userName ?? "Cliente",
          barbershopName: booking.barbershopName,
          serviceName: booking.serviceName,
          barberName: booking.barberName ?? "Barbeiro",
          date: booking.date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          time: booking.date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      }
    } catch (emailError) {
      console.error("Agendamento salvo, mas o e-mail falhou:", emailError)
    }

    return { success: true as const, bookingId: booking.id }
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o agendamento.",
    }
  }
}
