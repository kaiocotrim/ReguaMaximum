// // app/_actions/updateBookingStatus.ts
// "use server"

// import { db } from "@/app/_lib/prisma"
// import { BookingStatus } from "@/app/generated/prisma"
// import { revalidatePath } from "next/cache"

// export async function updateBookingStatus(
//   bookingId: string,
//   status: BookingStatus,
// ) {
//   await db.booking.update({
//     where: { id: bookingId },
//     data: { status },
//   })

//   revalidatePath("/agendamentos") // ajuste para a rota real da sua página
// }


// app/_actions/updateBookingStatus.ts
"use server"

import { db } from "@/app/_lib/prisma"
import { BookingStatus } from "@/app/generated/prisma"
import { revalidatePath } from "next/cache"

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
) {
  try {
    await db.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    revalidatePath("/agendamentos") // rota real (sem o route group)

    return { success: true as const }
  } catch (error) {
    console.error("Erro ao atualizar status do agendamento:", error)
    return { success: false as const, error: "Não foi possível atualizar o status." }
  }
}