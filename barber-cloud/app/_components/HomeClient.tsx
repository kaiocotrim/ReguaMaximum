"use client"

import { DashRing } from "@/app/_components/dash-ring"
import Image from "next/image"
import { Button } from "@/app/_components/ui/button"
import Header from "./header"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarImage } from "./ui/avatar"
import BarbershopItem from "./barbershop-item"
import SearchBar from "./SearchBar"
import { MapPin, Map, MapPinSearch } from "lucide-react"
import { motion } from "framer-motion"
import { Barbershop, Booking, BarbeshopService } from "@prisma/client"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/app/_components/ui/carousel"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
}

type BookingWithRelations = Booking & {
  service: Omit<BarbeshopService, "price"> & { price: number }
  barbershop: Barbershop
}

interface HomeClientProps {
  barbershops: Barbershop[]
  popularBarbershops: Barbershop[]
  confirmedBookings: BookingWithRelations[]
  loading?: boolean
}

export default function HomeClient({
  barbershops,
  popularBarbershops,
  confirmedBookings,
  loading,
}: HomeClientProps) {
  const { data: session } = useSession()
  const role = session?.user?.role
  const router = useRouter()

  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const bookingsToShow =
    confirmedBookings.length > 1
      ? [...confirmedBookings.slice(1), confirmedBookings[0]]
      : confirmedBookings

  const banner =
    resolvedTheme === "dark"
      ? "/bannerReguaM-dark.png"
      : "/bannerReguaM-light.png"

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <DashRing className="size-14" />
      </div>
    )
  }

  return (
    <div>
      <Header />

      <div className="space-y-6 px-6 py-6">
        {/* Saudação */}
        <motion.div
          className="space-y-1"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <h2 className="text-xl font-bold">
            Olá,{" "}
            <span className="shine-text">
              {session?.user?.name
                ? role === "BARBER"
                  ? `${session.user.name} vamos trabalhar hoje?`
                  : `${session.user.name} corte novo hoje?`
                : "iremos alinhar o cabelo?"}
            </span>
          </h2>

          <p className="text-sm text-gray-500">
            {format(new Date(), "EEEE, dd 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </motion.div>

        {/* Barra de pesquisa */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
        >
          <SearchBar />
        </motion.div>

         {/* Busca rápida */}
        <motion.div
          className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden "
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
        >
          {[
            { src: "/cabeloIcon.png", label: "Cabelo" },
            { src: "/barbarIcon.png", label: "Barba" },
            { src: "/acabamentoIcon.png", label: "Acabamento" },
            { src: "/acabamentoIcon.png", label: "Barbearias perto de você" },
            { src: "/acabamentoIcon.png", label: "Luzes" },
          ].map(({ src, label }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <Button
                className="cursor-pointer gap-1 whitespace-nowrap p-4 bg-card hover:bg-[#C3F32C] dark:bg-secondary"
                variant="secondary"
              >
                <span
                  role="img"
                  aria-label={label}
                  style={{
                    WebkitMaskImage: `url(${src})`,
                    maskImage: `url(${src})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                  className="h-4 w-4 shrink-0 bg-[#254F50] dark:bg-white"
                />
                <span className="ml-1">{label}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner Dinâmico */}
        <motion.div
          className="relative h-[150px] w-full overflow-hidden rounded-2xl border border-border/50 shadow-sm"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          whileHover={{ scale: 1.015 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        >
          {mounted && (
            <Image
              src={banner}
              alt="Banner Maximum"
              fill
              priority
              className="object-cover transition-all duration-500"
            />
          )}
        </motion.div>

        <div className="space-y-4">
          {/* ✅ Agendamentos — só aparece se tiver algum */}
          {confirmedBookings.length > 0 && (
            <>
              <motion.h2
                className="text-xs font-bold uppercase"
                variants={fadeIn}
                initial="hidden"
                animate="show"
                custom={4}
              >
                {confirmedBookings.length > 1
                  ? `Agendados (${confirmedBookings.length})`
                  : "Agendado"}
              </motion.h2>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={5}
              >
                <Carousel>
                  <CarouselContent className="-ml-2">
                    {bookingsToShow.map((booking) => (
                      <CarouselItem
                        key={booking.id}
                        className="basis-[90%] pl-2"
                      >
                        <Card
                          className="cursor-pointer dark:hover:bg-[#262626] hover:bg-black hover:bg-[#E6F4D4] "
                          onClick={() => router.push(`/appointments`)}
                        >
                          <CardContent className="flex justify-between p-0">
                            <div className="flex items-center gap-3 py-5 pl-5">
                              <Avatar className="h-14 w-14 border-2 border-solid border-white">
                                <AvatarImage
                                  src={booking.barbershop.imageUrl}
                                  alt={booking.barbershop.name}
                                />
                              </Avatar>
                              <div className="flex flex-col gap-2">
                                <Badge
                                  variant="outline"
                                  className="w-fit bg-[#C3F32C] font-bold text-[#254F50]"
                                >
                                  Confirmado
                                </Badge>
                                <h3 className="font-semibold">
                                  {booking.service.name}
                                </h3>
                                <span className="inline-flex items-center gap-1 text-sm">
                                  <MapPin size={14} />
                                  <span>{booking.barbershop.name}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                              <p className="text-sm capitalize">
                                {format(new Date(booking.date), "MMMM", {
                                  locale: ptBR,
                                })}
                              </p>
                              <p className="text-2xl font-bold">
                                {format(new Date(booking.date), "dd")}
                              </p>
                              <p className="text-sm font-bold">
                                {format(new Date(booking.date), "HH:mm")}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </motion.div>
            </>
          )}

          {/* Recomendações */}
          <div className="flex items-center justify-between">
            <motion.h2
              className="text-xs font-bold uppercase"
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={6}
            >
              Recomendações
            </motion.h2>

            <motion.h2
              className="text-xs font-bold uppercase flex cursor-pointer text-lime-400"
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={6}
              onClick={() => router.push(`/map`)}
            >
              Mapa
            </motion.h2>
          </div>

          <motion.div
            className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={7}
          >
            {barbershops.map((barbershop, i) => (
              <motion.div
                key={barbershop.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={7 + i * 0.5}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="pt-2"
              >
                <BarbershopItem barbershop={barbershop} />
              </motion.div>
            ))}
          </motion.div>

          {/* Populares */}
          <motion.h2
            className="text-xs font-bold uppercase"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={9}
          >
            Populares
          </motion.h2>

          <motion.div
            className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={10}
          >
            {popularBarbershops.map((barbershop, i) => (
              <motion.div
                key={barbershop.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={10 + i * 0.5}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="pt-2"
              >
                <BarbershopItem barbershop={barbershop} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
