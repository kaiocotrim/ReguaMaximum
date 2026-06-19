// import { db } from "../../_lib/prisma"
// import Image from "next/image"
// import { Button } from "../../_components/ui/button"
// import { ChevronLeft, MapIcon, StarIcon, User, Smartphone, Share, CircleUser } from "lucide-react"
// import Link from "next/link"
// import { Card } from "@/app/_components/ui/card"
// import ServiceItem from "@/app/_components/service-item"
// import PhoneItem from "@/app/_components/ui/phone-item"
// import MenuBtn from "@/app/_components/ui/MenuBtn"
// import FavoriteButton from "@/app/_components/favorite-button"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// interface BarbershopPageProps {
//   params: {
//     id: string
//   }
// }

// const BarbershopPage = async ({ params }: BarbershopPageProps) => {
//   const { id } = await params

//   const barbershop = await db.barbershop.findUnique({
//     where: { id },
//     include: {
//       services: true,
//       barbers: {
//         include: {
//           user: true, // ✅ inclui o User de cada Barber para mostrar o nome
//         },
//       },
//     },
//   })

//   if (!barbershop) return <p>Barbearia não encontrada.</p>

//   const session = await getServerSession(authOptions)

//   const isFavorited = session?.user?.id
//     ? !!(await db.favoriteBarbershop.findUnique({
//         where: {
//           userId_barbershopId: {
//             userId: (session.user as any).id,
//             barbershopId: id,
//           },
//         },
//       }))
//     : false

//   return (
//     <div>
//       <div className="relative h-[250px] w-full">
//         <Image
//           alt={`Imagem da barbearia ${barbershop.name}`}
//           fill
//           sizes="100vw"
//           className="rounded-b-2xl object-cover"
//           src={barbershop.imageUrl}
//         />
//         <Link href="/">
//           <Button size="icon" variant="" className="absolute top-4 left-4 bg-black cursor-pointer">
//             <ChevronLeft className="h-5 w-5 text-[#C3F32C]" />
//           </Button>
//         </Link>
//         <MenuBtn className="absolute top-4 right-4 cursor-pointer text-[#C3F32C] bg-black" />
//       </div>

//       <div className="flex p-6 pb-0">
//         <div>
//           <h1 className="mb-3 text-2xl font-bold text-[#C3F32C]">
//             <span className="shine-text">{barbershop.name}</span>
//           </h1>
//           <div className="mb-2 flex items-center gap-1">
//             <MapIcon className="h-4 w-4 text-[#254F50]" />
//             <p className="text-sm text-white">{barbershop.address}</p>
//           </div>
//           <div className="mb-2 flex items-center gap-1">
//             <StarIcon className="h-4 w-4 fill-[#254F50] text-[#254F50]" />
//             <p className="text-sm text-white">4,8 (899 avaliações)</p>
//           </div>
//         </div>

//         <div className="ml-auto flex flex-col items-stretch gap-2">
//           <FavoriteButton barbershopId={barbershop.id} initialFavorited={isFavorited} />

//           <Button className="bg-black/10" variant="secondary">
//             <Share className="h-2 w-2 text-[#C3F32C]" />
//             Compartilhar
//           </Button>

//           <Button className="bg-black/10" variant="secondary">
//             <CircleUser className="h-2 w-2 text-[#C3F32C]" />
//             Barbeiros: {barbershop.barbers.length} {/* ✅ número real */}
//           </Button>
//         </div>
//       </div>

//       {/* Descrição */}
//       <div className="mb-4 rounded-lg p-5 pb-0">
//         <Card className="mb-4 border-none p-4">
//           <div className="flex h-4 items-center gap-1">
//             <h2 className="m-0 pt-1 pl-1 text-[#C3F32C] uppercase">Sobre nós</h2>
//             <User className="h-5 w-5 text-[#C3F32C]" />
//           </div>
//           <p className="text-[15px] text-white">{barbershop.description}</p>
//         </Card>
//       </div>

//       {/* Banner */}
//       <div className="p-4 pb-0">
//         <div className="relative h-37.5 w-full overflow-hidden rounded-xl">
//           <img
//             src="/maoBannerSite.png"
//             alt="img"
//             className="h-full w-full object-cover"
//           />
//         </div>
//       </div>

//       {/* Serviços */}
//       <div className="p-5">
//         <h2 className="p-3 text-xs font-bold uppercase">Serviços</h2>
//         {barbershop.services.map((service) => (
//           <ServiceItem
//             key={service.id}
//             service={{
//               ...service,
//               price: Number(service.price),
//             }}
//             barbershopId={barbershop.id}         // ✅ passando barbershopId
//             barbers={barbershop.barbers}          // ✅ passando barbers reais do banco
//           />
//         ))}
//       </div>

//       {/* Contato */}
//       <div className="p-5">
//         {barbershop.phones.map((phone) => (
//           <div
//             key={phone}
//             className="mb-2 flex items-center justify-between gap-2 rounded-lg border p-4"
//           >
//             <div className="flex items-center gap-2">
//               <Smartphone className="text-[#C3F32C]" />
//               <p className="text-sm text-white">{phone}</p>
//             </div>
//             <div>
//               <PhoneItem phone={phone} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default BarbershopPage

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer"
import { db } from "../../_lib/prisma"
import Image from "next/image"
import { Button } from "../../_components/ui/button"
import {
  ChevronLeft,
  MapIcon,
  StarIcon,
  Smartphone,
  Share,
  CircleUser,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Card } from "@/app/_components/ui/card"
import ServiceItem from "@/app/_components/service-item"
import PhoneItem from "@/app/_components/ui/phone-item"
import MenuBtn from "@/app/_components/ui/MenuBtn"
import FavoriteButton from "@/app/_components/favorite-button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
      barbers: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!barbershop) return <p>Barbearia não encontrada.</p>

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

  return (
    <div className="pb-10">
      {/* Hero image */}
      {/* Hero image */}
      <div className="relative h-[260px] w-full">
        <Image
          alt={`Imagem da barbearia ${barbershop.name}`}
          fill
          sizes="100vw"
          className="rounded-b-3xl object-cover"
          src={barbershop.imageUrl}
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-20 rounded-b-3xl bg-gradient-to-t from-black/60 to-transparent" />

        <Link href="/">
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 left-4 cursor-pointer bg-black/70 backdrop-blur-sm hover:bg-black/90"
          >
            <ChevronLeft className="h-5 w-5 text-[#C3F32C]" />
          </Button>
        </Link>
        <MenuBtn className="absolute top-4 right-4 cursor-pointer bg-black/70 text-[#C3F32C] backdrop-blur-sm hover:bg-black/90" />

        {/* ─── Logo da barbearia ─── */}
        {/* TODO: trocar por barbershop.logoUrl quando o campo existir no schema */}

        {/* OPÇÃO 1 — Padrão (sem anel) */}
        {/* <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-full bg-zinc-800 ring-4 ring-[#171717]">
            <Image
              alt={`Logo da barbearia ${barbershop.name}`}
              fill
              sizes="80px"
              className="object-cover"
              src={barbershop.imageUrl}
            />
          </div> */}

        {/* OPÇÃO 2 — Clássico Instagram (gradiente colorido) */}
        <div
          className="absolute -bottom-10 left-6 h-20 w-20 rounded-full"
          style={{
            background: "conic-gradient(#f9ce34, #ee2a7b, #6228d7, #f9ce34)",
            padding: "4px",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              background: "#171717",
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              padding: "5px",
            }}
          >
            <Image
              alt={`Logo da barbearia ${barbershop.name}`}
              fill
              sizes="80px"
              className="rounded-full object-cover p-1"
              src={barbershop.imageUrl}
            />
          </div>
        </div>

        {/* OPÇÃO 3 — Verde (melhores amigos) ✅ ATIVO */}
        {/* <div
          className="absolute -bottom-10 left-6 h-20 w-20 rounded-full"
          style={{ background: "#22c55e", padding: "4px" }}
        >
          <div
            style={{
              borderRadius: "50%",
              background: "#171717",
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              padding: "5px",
            }}
          >
            <Image
              alt={`Logo da barbearia ${barbershop.name}`}
              fill
              sizes="80px"
              className="rounded-full object-cover p-1"
              src={barbershop.imageUrl}
            />
          </div>
        </div> */}
      </div>

      {/* Header info */}
      <div className="flex items-start justify-between gap-4 px-6 pt-14">
        <div className="min-w-0">
          <h1 className="mb-2 truncate text-2xl font-bold text-[#C3F32C]">
            <span className="shine-text">{barbershop.name}</span>
          </h1>

          <div className="mb-1.5 flex items-center gap-1.5">
            <MapIcon className="h-4 w-4 shrink-0 text-[#254F50]" />
            <p className="truncate text-sm text-zinc-300">
              {barbershop.address}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <StarIcon className="h-4 w-4 shrink-0 fill-[#254F50] text-[#254F50]" />
            <p className="text-sm text-zinc-300">4,8 · 899 avaliações</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2">
          <FavoriteButton
            barbershopId={barbershop.id}
            initialFavorited={isFavorited}
          />

          <Button
            className="cursor-pointer justify-start gap-2 bg-black/10 text-xs"
            variant="secondary"
            size="sm"
          >
            <Share className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
            Compartilhar
          </Button>

          {/* <Drawer  >
            <DrawerTrigger className="bg-black">
              <Button
                className="cursor-pointer justify-start gap-2 bg-black/10 text-xs"
                variant="secondary"
                size="sm"
              >
                <CircleUser className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
                {barbershop.barbers.length} barbeiro
                {barbershop.barbers.length !== 1 ? "s" : ""}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer> */}

          <Drawer>
            <DrawerTrigger className="bg-black">
              <Button
                className="cursor-pointer justify-start gap-2 bg-black/10 text-xs"
                variant="secondary"
                size="sm"
              >
                <CircleUser className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
                {barbershop.barbers.length} barbeiro
                {barbershop.barbers.length !== 1 ? "s" : ""}
              </Button>
            </DrawerTrigger>

            <DrawerContent className="border-t border-zinc-800 bg-zinc-950">
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-black tracking-tight text-white">
                  Nossos barbeiros
                </DrawerTitle>
                <DrawerDescription className="text-xs tracking-widest text-zinc-500 uppercase">
                  {/* This action cannot be undone. */}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                {/* <Button className="h-11 rounded-xl bg-[#C3F32C] font-bold text-black hover:bg-[#d4ff3d]">
                  Submit
                </Button> */}

                <Card className="border-none bg-black/10 p-4 " >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <img
                        src={"https://avatars.githubusercontent.com/u/175139628?v=4"}
                        alt={"https://avatars.githubusercontent.com/u/175139628?v=4"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-sm font-semibold text-white">
                        Kaio Alan (Cotrim)
                      </span>
                    </div>

                    <div>{/* Botão, avaliação, ação, etc. */} 
                      <ChevronRight >
                        
                      </ChevronRight>

                      </div>
                  </div>
                </Card>

                <DrawerClose>
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Sobre nós */}
      <div className="px-6 pt-6">
        <Card className="border-none bg-black/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-wide text-[#C3F32C] uppercase">
              Sobre nós
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            {barbershop.description}
          </p>
        </Card>
      </div>

      {/* Banner
      <div className="px-6 pt-6">
        <div className="relative h-32 w-full overflow-hidden rounded-2xl">
          <img
            src="/maoBannerSite.png"
            alt="Promoção"
            className="h-full w-full object-cover"
          />
        </div>
      </div> */}

      {/* Serviços */}
      <div className="px-6 pt-8">
        <h2 className="mb-3 text-xs font-bold tracking-wide text-[#C3F32C] uppercase">
          Serviços
        </h2>
        <div className="flex flex-col gap-3">
          {barbershop.services.map((service) => (
            <ServiceItem
              key={service.id}
              service={{
                ...service,
                price: Number(service.price),
              }}
              barbershopId={barbershop.id}
              barbers={barbershop.barbers}
            />
          ))}
        </div>
      </div>

      {/* Contato */}
      <div className="px-6 pt-8">
        <h2 className="mb-3 text-xs font-bold tracking-wide text-[#C3F32C] uppercase">
          Contato
        </h2>
        <div className="flex flex-col gap-2.5">
          {barbershop.phones.map((phone) => (
            <div
              key={phone}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/10 p-4"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-[#C3F32C]" />
                <p className="text-sm text-zinc-200">{phone}</p>
              </div>
              <PhoneItem phone={phone} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopPage
