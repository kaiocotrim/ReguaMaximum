import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import TotalAgend from "@/app/_components/dashboardComponents/agendamentos/total/page"

export default async function Agendamentos() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null // ou redirect("/login")
  }

  const bookings = await db.booking.findMany({
    where: {
      barbershop: {
        ownerId: session.user.id,
      },
    },
    include: {
      user: true,
      barber: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <div>

    
  
    </div>
  )
}