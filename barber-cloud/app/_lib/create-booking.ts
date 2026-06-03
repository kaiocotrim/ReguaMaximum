"use server"

import { db } from "@/app/_lib/prisma"
import { sendBookingEmail } from "./send-booking-email"

export const createBooking = async (data: {
  userId: string
  barbershopId: string
  serviceId: string
  barberId: string
  date: Date
}) => {
  const booking = await db.booking.create({
    data: {
      date: data.date,
      User:       { connect: { id: data.userId } },
      barbershop: { connect: { id: data.barbershopId } },
      Service:    { connect: { id: data.serviceId } },
      barber:     { connect: { id: data.barberId } },
    },
    include: {
      User:       true,
      barbershop: true,
      Service:    true,
      barber:     { include: { user: true } },
    },
  })

  await sendBookingEmail({
    toEmail:        booking.User.email!,
    userName:       booking.User.name ?? "Cliente",
    barbershopName: booking.barbershop.name,
    serviceName:    booking.Service.name,
    barberName:     booking.barber.user.name ?? "Barbeiro",
    date: booking.date.toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    }),
    time: booking.date.toLocaleTimeString("pt-BR", {
      hour: "2-digit", minute: "2-digit",
    }),
  })
}