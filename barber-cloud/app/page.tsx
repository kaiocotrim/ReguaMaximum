import Image from "next/image"
import { Button } from "@/app/_components/ui/button"
import Header from "./_components/header"
import { Input } from "./_components/ui/input"
import { SearchIcon, MapPin } from "lucide-react"
import { Card, CardContent } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import BarbershopItem from "./_components/barbershop-item"
import { db } from "./_lib/prisma"


{/*  Este componente é a página inicial da aplicação BarberCloud. Ele exibe um cabeçalho, uma saudação personalizada, uma barra de pesquisa, botões de busca rápida para diferentes categorias de serviços, um banner promocional, seções para agendamentos e recomendações de barbearias, além de um rodapé. A página utiliza o Prisma para buscar dados das barbearias no banco de dados e exibi-los usando componentes personalizados para criar uma interface atraente e funcional.*/}
export default async function Home() {
  const barbershops = await db.barbershop.findMany()

  const poularesBarber = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
    
  })

  return (
    <div>
      <Header />
      <div className="space-y-6 px-6 py-6">
        {/* Saudação */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold">
            Olá, <span className="shine-text">Bruno Odorissi Campaner.</span>
          </h2>
          <p className="text-sm text-gray-500">Segunda-feira, 12 de junho</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <Input placeholder="Pesquisar..." className="h-10" />
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 shrink-0 bg-green-600"
          >
            <SearchIcon className="text-white" />
          </Button>
        </div>

        {/* Busca rapida*/}
        <div className="flex gap-3 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <Button className="gap-1" variant='secondary'>
            <Image
              src="/cabeloIcon.png"
              alt="Ícone de barbearia"
              width={16}
              height={16}
            />
            <span className="ml-2">Cabelo</span>

          </Button>

          <Button className="gap-1" variant='secondary'>
            <Image
              src="/barbarIcon.png"
              alt="Ícone de barbearia"
              width={16}
              height={16}
            />
            <span className="ml-2">Barba</span>

          </Button>

          <Button className="gap-1" variant='secondary'>
            <Image
              src="/acabamentoIcon.png"
              alt="Ícone de barbearia"
              width={16}
              height={16}
            />
            <span className="ml-2">Acabamento</span>

          </Button>

          <Button className="gap-1" variant='secondary'>
            <Image
              src="/acabamentoIcon.png"
              alt="Ícone de barbearia"
              width={16}
              height={16}
            />
            <span className="ml-2">Barberia perto de voce</span>

          </Button>

          <Button className="gap-1" variant='secondary'>
            <Image
              src="/acabamentoIcon.png"
              alt="Ícone de barbearia"
              width={16}
              height={16}
            />
            <span className="ml-2">Luzes</span>

          </Button>
        </div>

        {/* Banner Image */}
        <div className="relative h-37.5 w-full overflow-hidden rounded-xl">
          <Image
            src="/bannerReguaM.png"
            alt="Banner-barberCloud"
            fill
            className="object-cover"
          />
        </div>

        {/* Agendamentos */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase">Agendado</h2>

          <Card>
            <CardContent className="flex justify-between p-0">
              {/* DIV esquerda */}
              <div className="flex items-center gap-3 py-5 pl-5">
                <Avatar className="h-14 w-14 border-2 border-solid border-white">
                  <AvatarImage
                    src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                    alt="Logo da barbearia"
                  />
                </Avatar>

                <div className="flex flex-col gap-2">
                  <Badge
                    variant="outline"
                    className="w-fit bg-[#C3F32C] font-bold text-[#254F50]"
                  >
                    Confirmado
                  </Badge>
                  <h3 className="font-semibold">Corte de cabelo</h3>
                  <span className="inline-flex items-center gap-1 text-sm">
                    <MapPin size={14} />
                    <span>Las Vegas Barbearia</span>
                  </span>
                </div>
              </div>

              {/* DIV direita */}
              <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                <p className="text-sm">Maio</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm font-bold">16:00</p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xs font-bold uppercase">Recomendações</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
          <h2 className="text-xs font-bold uppercase">Populares</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {poularesBarber.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>

        {/* Footer */}

      </div>
    </div>
  )
}
