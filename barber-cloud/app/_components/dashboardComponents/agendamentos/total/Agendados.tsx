import { Card } from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { deleteBooking } from "@/app/api/deleteBokings/delete-bookingBarber"

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
<Card className="mt-5 p-5 space-y-3 bg-black">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="group border border-zinc-800 rounded-xl p-4 flex justify-between items-center bg-zinc-950 hover:border-[#C3F32C]/40 transition-all"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">
                {appointment.user.name}
              </span>
              <span className="text-xs text-zinc-600">•</span>
              <span className="text-sm text-zinc-400">
                {appointment.date.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-300">
              <p>
                <span className="text-[#C3F32C]">Barbeiro:</span>{" "}
                {appointment.barber.nome}
              </p>
              <p>
                <span className="text-[#C3F32C]">Serviço:</span>{" "}
                {appointment.service.name}
              </p>
              <p>
                <span className="text-[#C3F32C]">Barbearia:</span>{" "}
                {appointment.barbershop.name}
              </p>
            </div>
          </div>

          <form action={deleteBooking.bind(null, appointment.id)}>
            <button
              type="submit"
              className="text-red-400 cursor-pointer hover:text-white hover:bg-red-500 border border-red-500/30 hover:border-red-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Excluir
            </button>
          </form>
        </div>
      ))}
    </Card>
  )
}