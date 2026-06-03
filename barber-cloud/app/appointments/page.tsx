import Header from "../_components/header"
import { db } from "../_lib/prisma"
import BarbershopItem from "../_components/barbershop-item"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"

import { CalendarCheck2 } from "lucide-react"
import Image from "next/image"

const AppointmentsPage = async () => {
    const appointments = await db.Booking.findMany({
        include: {
            barbershop: true,
        },
    })
  
    return (
    <div>
      <Header />

      <div className="m-5 ">
        <div className="border-border/40 bg-card rounded-xl border px-7 py-6 flex gap-2">
          {/* Badge */}
          <div>
            <div className="text-[#254F50] mb-4 flex items-center gap-1.5 text-[11px] font-medium tracking-widest uppercase">
              <CalendarCheck2 className="h-3 w-3 text-[#254F50]" />
              Agendamentos
            </div>

            {/* Título e descrição */}
            <h1 className="mb-1 text-[18px] leading-snug font-medium">
              Seus agendamentos
            </h1>
            <p className="text-muted-foreground mb-6 text-[13px]">
              Aqui você pode visualizar e gerenciar seus agendamentos.
            </p>
            
          </div>
          <div className="ml-auto">
            <Image
              src="/homenCalendario.png"
              alt="Sem agendamento"
              width={300}
              height={300}
            />
          </div>
        </div>

        {appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-4 mt-10 border border-border/40 rounded-xl   ">
              <Image
                src="/agendamentoNao2.png"
                alt="Sem agendamento"
                width={350}
                height={350}
              />
              <p className="text-sm text-muted-foreground">
                Você ainda não tem nenhum agendamento.
              </p>
            </div>
          ):(
          <div className="grid grid-cols-2 gap-5 p-5">
            {appointments.map((appointment) => (
              <BarbershopItem
                key={appointment.barbershop.id}
              barbershop={appointment.barbershop}
            />
          ))}
        </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage
