import { Card } from "@/app/_components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

export async function DashboardStatsCard() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  console.log(session)

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: userId,
    },
  })

  const totalBookings = await db.booking.count({
    where: {
      barbershopId: barbershop.id,
    },
  })

  return (
    <Card>
      <h2 className="text-lg font-semibold">Total de Agendamentos</h2>
      <p className="text-2xl font-bold">{totalBookings}</p>
      <div className="mt-2">
        <span className="text-muted-foreground text-sm">
          Agendamentos realizados
        </span>
      </div>
    </Card>
  )
}
