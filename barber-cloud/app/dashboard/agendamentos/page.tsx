import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Agendamentos() {
  const session = await getServerSession(authOptions)

  const agendamentos = await db.booking.findMany({
    where: {
      barbershop: {
        ownerId: session!.user.id,
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
      <h1 className="mb-2 text-2xl font-semibold">Agendamentos</h1>
      <p className="text-muted-foreground">
        Aqui você pode gerenciar todos os agendamentos da sua barbearia.
      </p>
      {agendamentos.map((booking) => (
        <div key={booking.id}>{booking.user.name}</div>
      ))}
    </div>
  )
}
