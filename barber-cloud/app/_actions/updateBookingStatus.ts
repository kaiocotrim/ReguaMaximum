// app/_actions/updateBookingStatus.ts
"use server"

import { db } from "@/app/_lib/prisma"
import { BookingStatus } from "@/app/generated/prisma"
import { revalidatePath } from "next/cache"

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  await db.booking.update({
    where: { id: bookingId },
    data: { status },
  })

  revalidatePath("/dashboard/agendamentos") // ajuste para a rota real da sua página
}