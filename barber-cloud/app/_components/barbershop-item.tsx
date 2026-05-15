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

{/*este componente é responsável por exibir as informações de uma barbearia em um formato de cartão, incluindo a imagem, nome, endereço e uma avaliação. Ele recebe um objeto do tipo `Barbershop` como prop e utiliza o Next.js Image para exibir a imagem da barbearia, além de estilizar o layout para apresentar as informações de forma clara e atraente. O componente também inclui um botão que direciona o usuário para a página de detalhes da barbearia.*/}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  
  return (
    <Card className="min-w-[167px] p-1 rounded-2xl">
      <CardContent className="p-0 px-1 pt-0 ">
        <div className="relative h-[159px] w-full">
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
          <h3 className="truncate font-semibold">{barbershop.name}</h3>
          <p className="truncate text-sm text-gray-500">{barbershop.address}</p>
          <Button className="mt-3 w-full bg-white font-bold">
            <Link href={`/barbershops/${barbershop.id}`}>Agendar</Link>
            <ChevronRight />
          </Button>
        </div>
        
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
