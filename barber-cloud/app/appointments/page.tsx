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
    redirect("/login")
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
    <div className="min-h-screen bg-[#f5f7f3] dark:bg-zinc-950">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-10 lg:px-8">

        {/* Banner */}
        <section className="relative flex min-h-[190px] overflow-hidden rounded-3xl border border-border/70 bg-card px-6 shadow-sm sm:min-h-[220px] sm:px-8 lg:min-h-[260px] lg:px-12">
          <div className="relative z-10 flex max-w-[62%] flex-col justify-center py-8 sm:max-w-[58%] lg:max-w-xl">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#557500] uppercase dark:text-[#C3F32C] lg:text-xs">
              <CalendarCheck2 className="h-4 w-4" />
              Agendamentos
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Seus agendamentos
            </h1>
            <p className="mt-3 max-w-lg text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Aqui você pode visualizar e gerenciar seus agendamentos.
            </p>
          </div>
          <div className="absolute inset-y-0 right-0 flex w-[46%] items-center justify-center sm:w-[42%] lg:right-8 lg:w-[38%]">
            <div className="absolute right-0 h-48 w-48 rounded-full bg-[#C3F32C]/10 blur-3xl sm:h-64 sm:w-64" />
            <Image
              src="/homenCalendario.png"
              alt="Sem agendamento"
              width={250}
              height={250}
              className="relative h-auto max-h-[180px] w-auto object-contain sm:max-h-[215px] lg:max-h-[250px]"
            />
          </div>
        </section>

        {/* Lista de agendamentos */}
        {appointments.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-card/60 px-6 text-center">
            <Image
              src="/agendamentoNao2.png"
              alt="Sem agendamento"
              width={200}
              height={200}
              className="h-auto w-40 sm:w-48"
            />
            <p className="text-muted-foreground text-sm">
              Você ainda não tem nenhum agendamento.
            </p>
          </section>
        ) : (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  Todos os agendamentos
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Consulte os detalhes ou gerencie um horário.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                {appointments.length} no total
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
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
          </section>
        )}

      </main>
    </div>
  )
}

export default AppointmentsPage
