import { Card } from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function StatsBarber() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  console.log(session)

  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: userId,
    },
  })

  const totalBarbers = await db.barber.count({
    where: {
      barbershopId: barbershop.id,
    },
  })

  return (
    <Card>
      <h2 className="text-lg font-semibold">Total Barbeiros</h2>
      <p className="text-2xl font-bold">{totalBarbers}</p>
      <div className="mt-2">
        <span className="text-muted-foreground text-sm">
          Barbers cadastrado no sistema
        </span>
      </div>
    </Card>
  )
}
