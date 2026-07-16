import { Card } from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"

export default async function Agendados() {
  const appointments = await db.booking.findMany({
    include: {
      user: true,
      barber: true,
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <Card className="mt-5">
      
        {appointments.map((appointment) => (
          <div key={appointment.id} className="">
            <p>Cliente:</p>
            <h2>{appointment.user.name}</h2>
            <p>Barbeiro</p>
            <p>{appointment.barber.nome}</p>
            <p>Serviço</p>
            <p>{appointment.service.name}</p>
            <p>Barbearia</p>
            <p>{appointment.barbershop.name}</p>
            <p>Data:</p>
            <p>{appointment.date.toLocaleString()}</p>
          </div>
        ))}

    </Card>
  )
}
