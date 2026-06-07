// import { getServerSession } from "next-auth/next" // <-- Faltava esse aqui!
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"     // <-- E garanta que a sua config do NextAuth está importada
// import { redirect } from "next/navigation"
// import Header from "../_components/header"
// import { db } from "../_lib/prisma"

// import { Card, CardContent } from "@/components/ui/card"
// import { CalendarCheck2 } from "lucide-react"
// import Image from "next/image"
// import AgendBarber from "../_components/agendBarber-item"

// const AppointmentsPage = async () => {
//   const session = await getServerSession(authOptions)

//   if (!session?.user) {
//     redirect("/")
//   }

//   const appointments = await db.Booking.findMany({
//     where: {
//       userId: (session.user as any).id, // Filtra estritamente pelo ID dele
//     },
//     include: {
//       barbershop: true,
//     },
//   })

//   return (
//     <div>
//       <Header />

//       <div className="m-5">
//         <div className="border-border/40 bg-card flex gap-2 rounded-xl border px-5">
//           {/* Badge */}
//           <div>
//             <div className="mt-5 mb-4 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-[#254F50] uppercase">
//               <CalendarCheck2 className="h-3 w-3 text-[#254F50]" />
//               Agendamentos
//             </div>

//             {/* Título e descrição */}
//             <h1 className="mb-1 text-[15px] leading-snug font-medium">
//               Seus agendamentos
//             </h1>
//             <p className="text-muted-foreground mb-6 text-[10px]">
//               Aqui você pode visualizar e gerenciar seus agendamentos.
//             </p>
//           </div>
//           <div className="ml-auto pt-4 pb-4">
//             <Image
//               src="/homenCalendario.png"
//               alt="Sem agendamento"
//               width={250}
//               height={250}
//             />
//           </div>
//         </div>

//         {appointments.length === 0 ? (
//           <div className="mt-10 flex flex-col items-center gap-4 rounded-xl">
//             <Image
//               src="/agendamentoNao2.png"
//               alt="Sem agendamento"
//               width={200}
//               height={200}
//             />
//             <p className="text-muted-foreground text-sm">
//               Você ainda não tem nenhum agendamento.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-5 p-5">
//             {appointments.map((appointment) => (
//               <AgendBarber key={appointment.id} appointment={appointment} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AppointmentsPage
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

  const appointments = await db.Booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      barbershop: true,
      Service: true,
      barber: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <Header />

      <div className="m-5 flex flex-col gap-5">

        {/* Banner */}
        <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5">
          <div className="flex flex-col justify-center">
            <div className="mt-5 mb-4 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-[#C3F32C] uppercase">
              <CalendarCheck2 className="h-3 w-3" />
              Agendamentos
            </div>
            <h1 className="mb-1 text-[15px] leading-snug font-medium text-white">
              Seus agendamentos
            </h1>
            <p className="text-zinc-500 mb-6 text-[10px]">
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
            <p className="text-zinc-500 text-sm">
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
                  barbershop: appointment.barbershop,
                  service: {
                    name: appointment.Service?.name ?? "Serviço",
                    price: Number(appointment.Service?.price ?? 0),
                  },
                  barber: {
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