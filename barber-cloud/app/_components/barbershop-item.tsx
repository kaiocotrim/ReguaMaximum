import Image from "next/image"
import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Star, ChevronRight } from "lucide-react"
import { Badge } from "./ui/badge"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] p-1 rounded-2xl hover:bg-accent cursor-pointer transition-all ">
      <CardContent className="p-0 px-1 pt-0 ">
        <div className="relative h-[159px] w-full ">
          <Image
            fill
            className="rounded-2xl object-cover p-1"
            src={barbershop.imageUrl}
            alt={`Barbershop: ${barbershop.name}`}
          />

          <Badge className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[#C3F32C] px-2 py-1 text-xs text-[#254F50]">
            <Star className="h-3 w-3" fill="#254F50" />
            4.8
          </Badge>
        </div>

        {/* Nome da barbearia */}
        <div className="px-1 py-3">
          <h3 className="truncate font-semibold text-foreground">{barbershop.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{barbershop.address}</p>
          <Link href={`/barbershops/${barbershop.id}`}>
            <Button className="mt-3 w-full font-bold text-foreground dark:text-[#254F50] hover:bg-[#C3F32C] hover:text-[#254F50] dark:hover:text-[#254F50] cursor-pointer">
              Agendar
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem