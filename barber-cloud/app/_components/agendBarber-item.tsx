import { Card, CardContent } from "./ui/card";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/_lib/auth" // 
import { redirect } from "next-navigation" // 
import Image from "next/image";



interface AgendBarberProps {
  appointment: {
    id: string
    date: Date
    barbershop: {
      name: string
      imageUrl: string
      address: string
    }
  }
}

// 2. O componente recebe a propriedade "appointment"
const AgendBarber = ({ appointment }: AgendBarberProps) => {
  return (
    <Card className="min-w-[167px] p-1 rounded-2xl hover:bg-zinc-900 cursor-pointer transition-all bg-card text-card-foreground border border-border">
      <CardContent className="p-2 flex flex-col gap-2">
        
        {/* Imagem da Barbearia */}
        <div className="relative h-[159px] w-full">
          <Image
            src={appointment.barbershop.imageUrl}
            alt={appointment.barbershop.name}
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* Textos com as informações */}
        <div className="flex flex-col gap-1 px-1">
          {/* Nome da Barbearia */}
          <h3 className="font-semibold text-sm truncate">
            {appointment.barbershop.name}
          </h3>
          
          {/* Data do Agendamento formatada */}
          <p className="text-xs text-muted-foreground">
            {new Date(appointment.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
            })}
          </p>
          
          {/* Horário do Agendamento */}
          <p className="text-xs text-primary font-medium">
            {new Date(appointment.date).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })} hs
          </p>
        </div>

      </CardContent>
    </Card>
  )
}

export default AgendBarber