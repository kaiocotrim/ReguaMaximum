import { db } from "../../_lib/prisma"
import Image from "next/image"
import { Button } from "../../_components/ui/button"
import { ChevronLeft, MapIcon, MenuIcon, StarIcon } from "lucide-react"
import Link from "next/link"
import { Card } from "@/app/_components/ui/card"
import ServiceItem from "@/app/_components/service-item"
import { User } from "lucide-react"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const { id } = await params

  const barbershop = await db.barbershop.findUnique({
    where: { id },

    include: {
      services: true,
    },
  })

  if (!barbershop) return <p>Barbearia não encontrada.</p>

  console.log("Barbearia encontrada:", barbershop.services)

  return (
    <div >
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
          className="absolute top-4 right-4 bg-black"
        >
          <Link href="/">
            <MenuIcon className="h-5 w-5 text-[#C3F32C]" />
          </Link>
        </Button>
      </div>

      {/* <h2 className="text-xl font-bold">
            Olá, <span className="shine-text">Bruno Odorissi Campaner.</span>
          </h2> */}

      {/* Exibir nome da barbearia */}
      <div className="relative p-4 pb-0">
        <h1 className="mb-3 text-2xl font-bold text-[#C3F32C]">
          <span className="shine-text">{barbershop.name}</span>{" "}
        </h1>

        <div className="mb-2 flex items-center gap-1">
          <MapIcon className="size={18} h-4 w-4 text-[#254F50]" />
          <p className="text-sm text-white">{barbershop.address}</p>
        </div>
        {/* Exibir endereço da barbearia */}
        <div className="mb-2 flex items-center gap-1">
          <StarIcon className="h-4 w-4 fill-[#254F50] text-[#254F50]" />
          <p className="text-sm text-white">4,8 (899 avaliações)</p>
        </div>
      </div>

      {/* Exibir descrição da barbearia */}
      <div className="mb-4 rounded-lg p-4 pb-0">
        <Card className="mb-4 border-none p-4">
          <div className="flex items-center gap-1 h-4">
            <h2 className="pl-1 text-[#C3F32C] uppercase m-0 pt-1">Sobre nós</h2>
             <User className="text-[#C3F32C] h-5 w-5" />
          </div>
          <p className="text-[15px] text-white ">
            {barbershop.description}
          </p>
        </Card>
      </div>

      {/* Banner Image */}
      <div className="p-4 pb-0">
        <div className="relative h-37.5 w-full overflow-hidden rounded-xl">
          <img
            src="/maoBannerSite.png"
            alt="img"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-xs font-bold uppercase p-3">Serviços</h2>
        {barbershop.services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

export default BarbershopPage
