import Image from "next/image"
import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import {Star } from "lucide-react"
import { Badge } from "./ui/badge"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    
    <Card className="min-w-[167px] rounded-2xl">
      <CardContent className="p-0 px-1 pt-0">
        <div className="relative h-[159px] w-full">
          <Image
            fill
            className="rounded-2xl object-cover"
            src={barbershop.imageUrl}
            alt={`Barbershop: ${barbershop.name}`}
          />


      <Badge className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-yellow-600 px-2 py-1 text-xs text-white">
        <Star className="h-3 w-3" />
        4.8
      </Badge>
          
        </div>

        {/* Nome da barbearia */}
        <div className="px-1 py-3">
          <h3 className="truncate font-semibold">{barbershop.name}</h3>
          <p className="truncate text-sm text-gray-500">{barbershop.address}</p>
          <Button className="mt-3 w-full">Agendar</Button>
        </div>
      </CardContent>

         
      
    </Card>
  )
}

export default BarbershopItem
