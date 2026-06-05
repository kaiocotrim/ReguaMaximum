import { getServerSession } from "next-auth/next" // <-- Faltava esse aqui!
import { authOptions } from "@/app/api/auth/[...nextauth]/route"     // <-- E garanta que a sua config do NextAuth está importada
import { redirect } from "next/navigation"
import Header from "../_components/header"
import { db } from "../_lib/prisma"


import { CalendarCheck2 } from "lucide-react"
import Image from "next/image"
import AgendBarber from "../_components/agendBarber-item"

const AppointmentsPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/")
  }

  const appointments = await db.Booking.findMany({
    where: {
      userId: (session.user as any).id, // Filtra estritamente pelo ID dele
    },
    include: {
      barbershop: true,
    },
  })

  return (
    <div>
      <Header />

      <div className="m-5">
        <div className="border-border/40 bg-card flex gap-2 rounded-xl border px-5">
          {/* Badge */}
          <div>
            <div className="mt-5 mb-4 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-[#254F50] uppercase">
              <CalendarCheck2 className="h-3 w-3 text-[#254F50]" />
              Agendamentos
            </div>

            {/* Título e descrição */}
            <h1 className="mb-1 text-[15px] leading-snug font-medium">
              Seus agendamentos
            </h1>
            <p className="text-muted-foreground mb-6 text-[10px]">
              Aqui você pode visualizar e gerenciar seus agendamentos.
            </p>
          </div>
          <div className="ml-auto pt-4 pb-4">
            <Image
              src="/homenCalendario.png"
              alt="Sem agendamento"
              width={250}
              height={250}
            />
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-xl">
            <Image
              src="/agendamentoNao2.png"
              alt="Sem agendamento"
              width={200}
              height={200}
            />
            <p className="text-muted-foreground text-sm">
              Você ainda não tem nenhum agendamento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 p-5">
            {appointments.map((appointment) => (
              <AgendBarber key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage
