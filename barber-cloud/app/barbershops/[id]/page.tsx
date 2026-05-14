import { db } from "../../_lib/prisma"
import Image from "next/image"
import { Button } from "../../_components/ui/button"
import { ChevronLeft, MapIcon, MenuIcon, Star, StarIcon } from "lucide-react"
import Link from "next/link"
import { Card } from "@/app/_components/ui/card"


interface BarbershopPageProps {
  params: {
    id: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const { id } = await params

  const barbershop = await db.barbershop.findUnique({
    where: { id },
  })

  if (!barbershop) return <p>Barbearia não encontrada.</p>

  return (
    <div>
      {/* Exibir img da barbearia */}
      <div className="relative h-[250px] w-full">
        <Image
          alt={`Imagem da barbearia ${barbershop.name}`}
          fill
          className="object-cover"
          src={barbershop?.imageUrl}
        />

        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 left-4 bg-black"
        >
          <Link href="/">
            <ChevronLeft className="h-5 w-5 text-[#C3F32C]" />
          </Link>
        </Button>

        
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4  bg-black"
        >
          <Link href="/">
            <MenuIcon className="h-5 w-5 text-[#C3F32C]" />
          </Link>
        </Button>

      </div>
      {/* Exibir nome da barbearia */}      
      <div className="relative p-5 pb-0">
        <h1 className="mb-3 text-2xl font-bold text-[#C3F32C]">{barbershop.name}</h1>

        <div className="mb-2 flex items-center gap-1">
          <MapIcon className="h-4 w-4 text-gray-400 size={18}" />
          <p className="text-sm text-white">{barbershop.address}</p>
        </div>
        {/* Exibir endereço da barbearia */} 
        <div className="mb-2 flex items-center gap-1">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400"  />
          <p className=" text-sm text-white">4,8 (899 avaliações)</p>
        </div>

      </div>
      {/* Exibir descrição da barbearia */}
      <div className="p-2 bg-black rounded-lg mb-4  ">
        <Card className=" border-none p-4 mb-4">
          <p className="text-[13px] font-[Arial]  text-white">{barbershop.description}</p>
        </Card>
      </div>
    </div>
  )
}

export default BarbershopPage
