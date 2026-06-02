"use server"

import { db } from "@/app/_lib/prisma"

export const createBooking = async (data: {
  userId: string
  barbershopId: string
  serviceId: string
  barberId: string
  date: Date
}) => {
  await db.booking.create({
    data,
  })
}