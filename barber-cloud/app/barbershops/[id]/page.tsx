import { db } from "../../_lib/prisma"
import Image from "next/image"
import { Button } from "../../_components/ui/button"
import {
  ChevronLeft,
  MapIcon,
  MenuIcon,
  StarIcon,
  User,
  Smartphone,
  Heart,
  Share,
  CircleUser,
} from "lucide-react"
import Link from "next/link"
import { Card } from "@/app/_components/ui/card"
import ServiceItem from "@/app/_components/service-item"
import PhoneItem from "@/app/_components/ui/phone-item"
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet"

import MenuBtn from "@/app/_components/ui/MenuBtn"

import FavoriteButton from "@/app/_components/favorite-button"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

{
  /*
  Este componente é responsável por exibir os detalhes de uma barbearia específica, incluindo sua imagem, nome, endereço, descrição, serviços oferecidos e informações de contato. Ele utiliza o Prisma para buscar os dados da barbearia no banco de dados com base no ID fornecido nos parâmetros da URL. A interface do usuário é construída usando componentes personalizados e ícones para melhorar a experiência visual.
*/
}

const barbershop = await db.barbershop.findUnique({
  where: { id },
  include: { services: true },
})

if (!barbershop) return <p>Barbearia não encontrada.</p>

// ← Adiciona isso aqui:
const session = await getServerSession(authOptions)

const isFavorited = session?.user?.id
  ? !!(await db.favoriteBarbershop.findUnique({
      where: {
        userId_barbershopId: {
          userId: (session.user as any).id,
          barbershopId: id,
        },
      },
    }))
  : false

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
    <div>
      {/* Exibir img da barbearia */}
      <div className="relative h-[250px] w-full">
        <Image
          alt={`Imagem da barbearia ${barbershop.name}`}
          fill
          className="rounded-b-2xl object-cover"
          src={barbershop?.imageUrl}
        />

        {/* Botões de navegação */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-4 left-4 h-10 w-10 !bg-black"
        >
          <Link href="/">
            <ChevronLeft className="h-5 w-5 text-[#C3F32C]" />
          </Link>
        </Button>

        {/* <Sheet>
          
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
                        className="absolute top-4 right-4 h-10 w-10 bg-black text-[#C3F32C]"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-slate-900">
            <p>Oi</p>
          </SheetContent>
        </Sheet> */}
        <MenuBtn className="absolute top-4 right-4 h-10 w-10 bg-black text-[#C3F32C]" />
      </div>

      {/* Exibir nome da barbearia */}
      <div className="flex p-6 pb-0">
        <div className="">
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

        {/* Mini ações */}
        <div className="ml-auto flex flex-col items-stretch gap-2">
          <FavoriteButton barbershopId={barbershop.id} initialFavorited={isFavorited} />


          <Button className="bg-black/10" variant="secondary">
            <Share className="h-2 w-2 text-[#C3F32C]" />
            Compartilhar
          </Button>

          <Button className="bg-black/10" variant="secondary">
            <CircleUser className="h-2 w-2 text-[#C3F32C]" />
            Barbeiros: 3
          </Button>
        </div>
      </div>

      {/* Exibir descrição da barbearia */}
      <div className="mb-4 rounded-lg p-5 pb-0">
        <Card className="mb-4 border-none p-4">
          <div className="flex h-4 items-center gap-1">
            <h2 className="m-0 pt-1 pl-1 text-[#C3F32C] uppercase">
              Sobre nós
            </h2>
            <User className="h-5 w-5 text-[#C3F32C]" />
          </div>
          <p className="text-[15px] text-white">{barbershop.description}</p>
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

      {/* Exibir serviços da barbearia */}
      <div className="p-5">
        <h2 className="p-3 text-xs font-bold uppercase">Serviços</h2>
        {/* {barbershop.services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))} */}
        {barbershop.services.map((service) => (
          <ServiceItem
            key={service.id}
            service={{
              ...service,
              price: Number(service.price),
            }}
          />
        ))}
      </div>

      {/* Contato */}
      <div className="p-5">
        {barbershop.phones.map((phone) => (
          <div
            key={phone}
            className="mb-2 flex items-center justify-between gap-2 rounded-lg border p-4"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="text-[#C3F32C]" />
              <p className="text-sm text-white">{phone}</p>
            </div>
            <div>
              {/* <Button
                size="sm"
                className="bg-[#C3F32C] text-[#254F50] hover:bg-[#C3F32C]/90"
              >
                Copiar
                <Copy />
              </Button> */}
              <PhoneItem key={phone} phone={phone} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarbershopPage
