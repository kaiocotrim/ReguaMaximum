import Image from "next/image"
import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[159px]">
      <CardContent>
        <div className="relative h-[159px] w-full">
          <Image
            fill
            className="object-cover"
            src={barbershop.imageUrl}
            alt={`Barbershop: ${barbershop.name}`}  
          />
        </div>
        {/* Nome da barbearia */}
        <div className="px-2 pb-3">
            <h3>{barbershop.name}</h3>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
