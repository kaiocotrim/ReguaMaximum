import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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

  const appointments = await db.booking.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      date: true,
      status: true,
      durationMinutes: true,
      agreedPrice: true,
      barbershop: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          address: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
      barber: {
        select: {
          id: true,
          favoritedBy: {
            where: { userId: session.user.id },
            select: { id: true },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="m-5 flex flex-col gap-5">

        {/* Banner */}
        <div className="flex gap-2 rounded-2xl border border-border bg-card backdrop-blur-md px-5">
          <div className="flex flex-col justify-center">
            <div className="mt-5 mb-4 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-[#C3F32C] uppercase">
              <CalendarCheck2 className="h-3 w-3" />
              Agendamentos
            </div>
            <h1 className="mb-1 text-[15px] leading-snug font-medium text-foreground">
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

        {/* Lista de agendamentos */}
        {appointments.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4">
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
          <div className="flex flex-col gap-4">
            {appointments.map((appointment) => (
              <AgendBarber
                key={appointment.id}
                appointment={{
                  id: appointment.id,
                  date: appointment.date,
                  status: appointment.status,
                  barbershop: {
                    id: appointment.barbershop.id,
                    name: appointment.barbershop.name,
                    imageUrl: appointment.barbershop.imageUrl,
                    address: appointment.barbershop.address,
                  },
                  service: {
                    id: appointment.service.id,
                    name: appointment.service?.name ?? "Serviço",
                    price: Number(
                      appointment.agreedPrice ?? appointment.service.price,
                    ),
                    duration:
                      appointment.durationMinutes ??
                      appointment.service.duration,
                  },
                  barber: {
                    id: appointment.barber.id,
                    isFavorited: appointment.barber.favoritedBy.length > 0,
                    user: {
                      name: appointment.barber?.user?.name ?? null,
                      image: appointment.barber?.user?.image ?? null,
                    },
                  },
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default AppointmentsPage
