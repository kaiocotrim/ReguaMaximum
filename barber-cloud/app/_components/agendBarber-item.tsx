import { User, Calendar, Clock } from "lucide-react"
import Image from "next/image"

interface AgendBarberProps {
  appointment: {
    id: string
    date: Date
    barbershop: {
      name: string
      imageUrl: string
      address: string
    }
    service: {
      name: string
      price: number
      duration?: number | null
    }
    barber: {
      user: {
        name: string | null
        image: string | null
      }
    }
  }
}

const AgendBarber = ({ appointment }: AgendBarberProps) => {
  const { service, barber, date, barbershop } = appointment

  const isPast = new Date(date) < new Date()

  const month = new Date(date).toLocaleDateString("pt-BR", { month: "long" })
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1)
  const day = new Date(date).getDate()
  const formattedTime = new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-transparent backdrop-blur-xl overflow-hidden flex cursor-pointer transition-all duration-200 hover:bg-white/[0.07]">

      {/* Esquerda — logo + infos */}
      <div className="flex items-center gap-4 flex-1 min-w-0 p-4">

        {/* Avatar da barbearia */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shrink-0">
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Textos */}
        <div className="flex flex-col gap-1.5 min-w-0">

          {/* Badge */}
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
            isPast
              ? "bg-zinc-700 text-white"
              : "bg-[#C3F32C] text-[#254F50]"
          }`}>
            {isPast ? "Finalizado" : "Confirmado"}
          </div>

          {/* Serviço */}
          <p className="text-white text-[15px] font-semibold tracking-tight truncate">
            {service?.name ?? "Serviço"}
          </p>

          {/* Barbearia */}
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-white shrink-0" />
            <span className="text-[12px] text-white truncate">
              {barbershop.name}
            </span>
          </div>

        </div>
      </div>

      {/* Direita — data */}
      <div className="flex flex-col items-center justify-center border-l border-white/10 px-5 shrink-0 gap-0.5">
        <p className="text-[12px] text-zinc-400 capitalize">{monthCapitalized}</p>
        <p className="text-[28px] font-bold text-white leading-none">{day}</p>
        <p className="text-[12px] font-semibold text-zinc-400">{formattedTime}</p>
      </div>

    </div>
  )
}

export default AgendBarber