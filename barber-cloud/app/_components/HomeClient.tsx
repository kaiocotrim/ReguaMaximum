// "use client"

// import { DashRing } from "@/app/_components/dash-ring"
// import Image from "next/image"
// import { Button } from "@/app/_components/ui/button"
// import Header from "./header"
// import { Card, CardContent } from "./ui/card"
// import { Badge } from "./ui/badge"
// import { Avatar, AvatarImage } from "./ui/avatar"
// import BarbershopItem from "./barbershop-item"
// import SearchBar from "./SearchBar"
// import { MapPin } from "lucide-react"
// import { motion } from "framer-motion"
// import { Barbershop, Booking, BarbeshopService } from "@prisma/client"
// import { useSession } from "next-auth/react"
// import { format } from "date-fns"
// import { ptBR } from "date-fns/locale"
// import { useRouter } from "next/navigation"

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
// } from "@/app/_components/ui/carousel"



// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   show: (i: number = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
//   }),
// }

// const fadeIn = {
//   hidden: { opacity: 0 },
//   show: (i: number = 0) => ({
//     opacity: 1,
//     transition: { duration: 0.4, delay: i * 0.08 },
//   }),
// }

// // Tipo com os includes do Prisma
// type BookingWithRelations = Booking & {
//   Service: Omit<BarbeshopService, "price"> & { price: number }
//   barbershop: Barbershop
// }

// interface HomeClientProps {
//   barbershops: Barbershop[]
//   popularBarbershops: Barbershop[]
//   confirmedBookings: BookingWithRelations[]
//   loading?: boolean
// }

// export default function HomeClient({
//   barbershops,
//   popularBarbershops,
//   confirmedBookings,
//   loading,
// }: HomeClientProps) {
//   // ✅ Hook sempre primeiro
//   const { data: session } = useSession()
//   const router = useRouter()
//   // ✅ Lógica depois
//   const bookingsToShow =
//     confirmedBookings.length > 1
//       ? [...confirmedBookings.slice(1), confirmedBookings[0]]
//       : confirmedBookings

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <DashRing className="size-14" />
//       </div>
//     )
//   }

//   // Adiciona isso ANTES do return, junto com as outras variáveis


//   return (
//     <div>
//       <Header />
//       <div className="space-y-6 px-6 py-6">
//         {/* Saudação */}
//         <motion.div
//           className="space-y-1"
//           variants={fadeUp}
//           initial="hidden"
//           animate="show"
//           custom={0}
//         >
//           <h2 className="text-xl font-bold">
//             Olá,{" "}
//             <span className="shine-text">
//               {session?.user?.name
//                 ? `${session.user.name}, reguada hoje?`
//                 : "iremos alinhar o cabelo?"}
//             </span>
//           </h2>
//           <p className="text-sm text-gray-500">
//             {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
//           </p>
//         </motion.div>

//         {/* Barra de pesquisa */}
//         <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
//           <SearchBar />
//         </motion.div>

//         {/* Busca rápida */}
//         <motion.div
//           className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden"
//           variants={fadeUp}
//           initial="hidden"
//           animate="show"
//           custom={2}
//         >
//           {[
//             { src: "/cabeloIcon.png", label: "Cabelo" },
//             { src: "/barbarIcon.png", label: "Barba" },
//             { src: "/acabamentoIcon.png", label: "Acabamento" },
//             { src: "/acabamentoIcon.png", label: "Barberia perto de você" },
//             { src: "/acabamentoIcon.png", label: "Luzes" },
//           ].map(({ src, label }) => (
//             <motion.div
//               key={label}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               transition={{ type: "spring", stiffness: 300, damping: 20 }}
//             >
//               <Button
//                 className="cursor-pointer gap-1 p-4 whitespace-nowrap hover:bg-[#C3F32C] hover:text-white"
//                 variant="secondary"
//               >
//                 <Image src={src} alt={label} width={16} height={16} />
//                 <span className="ml-2">{label}</span>
//               </Button>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Banner */}
//         <motion.div
//           className="relative h-37.5 w-full overflow-hidden rounded-xl"
//           variants={fadeUp}
//           initial="hidden"
//           animate="show"
//           custom={3}
//           whileHover={{ scale: 1.015 }}
//           transition={{ type: "spring", stiffness: 200, damping: 25 }}
//         >
//           <Image
//             src="/bannerReguaM.png"
//             alt="Banner-barberCloud"
//             fill
//             className="object-cover"
//           />
//         </motion.div>

//         <div className="space-y-4">
//           {/* ✅ Agendamentos — só aparece se tiver algum */}
//           {confirmedBookings.length > 0 && (
//             <>
//               <motion.h2
//                 className="text-xs font-bold uppercase"
//                 variants={fadeIn}
//                 initial="hidden"
//                 animate="show"
//                 custom={4}
//               >
//                 {confirmedBookings.length > 1
//                   ? `Agendados (${confirmedBookings.length})`
//                   : "Agendado"}
//               </motion.h2>

//               <motion.div
//                 variants={fadeUp}
//                 initial="hidden"
//                 animate="show"
//                 custom={5}
//               >
//                 <Carousel>
//                   <CarouselContent className="-ml-2">
//                     {bookingsToShow.map((booking) => (
//                       <CarouselItem key={booking.id} className="pl-2 basis-[90%]">
//                         <Card
//                           className="cursor-pointer hover:bg-black"
//                           onClick={() => router.push(`/appointments`)}
//                         >
//                           <CardContent className="flex justify-between p-0">
//                             <div className="flex items-center gap-3 py-5 pl-5">
//                               <Avatar className="h-14 w-14 border-2 border-solid border-white">
//                                 <AvatarImage
//                                   src={booking.barbershop.imageUrl}
//                                   alt={booking.barbershop.name}
//                                 />
//                               </Avatar>
//                               <div className="flex flex-col gap-2">
//                                 <Badge
//                                   variant="outline"
//                                   className="w-fit bg-[#C3F32C] font-bold text-[#254F50]"
//                                 >
//                                   Confirmado
//                                 </Badge>
//                                 <h3 className="font-semibold">{booking.Service.name}</h3>
//                                 <span className="inline-flex items-center gap-1 text-sm">
//                                   <MapPin size={14} />
//                                   <span>{booking.barbershop.name}</span>
//                                 </span>
//                               </div>
//                             </div>
//                             <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
//                               <p className="text-sm capitalize">
//                                 {format(new Date(booking.date), "MMMM", { locale: ptBR })}
//                               </p>
//                               <p className="text-2xl font-bold">
//                                 {format(new Date(booking.date), "dd")}
//                               </p>
//                               <p className="text-sm font-bold">
//                                 {format(new Date(booking.date), "HH:mm")}
//                               </p>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </CarouselItem>
//                     ))}
//                   </CarouselContent>
//                 </Carousel>
//               </motion.div>
//             </>
//           )}



//           {/* Recomendações */}
//           <motion.h2
//             className="text-xs font-bold uppercase"
//             variants={fadeIn}
//             initial="hidden"
//             animate="show"
//             custom={6}
//           >
//             Recomendações
//           </motion.h2>

//           <motion.div
//             className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden"
//             variants={fadeUp}
//             initial="hidden"
//             animate="show"
//             custom={7}
//           >
//             {barbershops.map((barbershop, i) => (
//               <motion.div
//                 key={barbershop.id}
//                 variants={fadeUp}
//                 initial="hidden"
//                 animate="show"
//                 custom={7 + i * 0.5}
//                 whileHover={{ y: -4, scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 260, damping: 20 }}
//                 className="pt-2"
//               >
//                 <BarbershopItem barbershop={barbershop} />
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Populares */}
//           <motion.h2
//             className="text-xs font-bold uppercase"
//             variants={fadeIn}
//             initial="hidden"
//             animate="show"
//             custom={9}
//           >
//             Populares
//           </motion.h2>

//           <motion.div
//             className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden"
//             variants={fadeUp}
//             initial="hidden"
//             animate="show"
//             custom={10}
//           >
//             {popularBarbershops.map((barbershop, i) => (
//               <motion.div
//                 key={barbershop.id}
//                 variants={fadeUp}
//                 initial="hidden"
//                 animate="show"
//                 custom={10 + i * 0.5}
//                 whileHover={{ y: -4, scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 260, damping: 20 }}
//                 className="pt-2"
//               >
//                 <BarbershopItem barbershop={barbershop} />
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }

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
import { MapPin, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Barbershop, Booking, BarbeshopService } from "@prisma/client"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/_components/ui/carousel"

// ─── Variantes de animação ───────────────────────────────────────────────────
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

// ─── Tokens de tema ──────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "bg-zinc-950",
    surface: "bg-zinc-900",
    border: "border-white/10",
    text: "text-white",
    textMuted: "text-gray-400",
    textSub: "text-gray-500",
    cardBg: "bg-zinc-900 hover:bg-zinc-800",
    cardBorder: "border-zinc-800",
    toggleBg: "bg-zinc-800",
    toggleIcon: "text-yellow-400",
    sectionLabel: "text-zinc-400",
  },
  light: {
    bg: "bg-gray-50",
    surface: "bg-white",
    border: "border-gray-200",
    text: "text-zinc-900",
    textMuted: "text-zinc-500",
    textSub: "text-zinc-400",
    cardBg: "bg-white hover:bg-gray-50",
    cardBorder: "border-gray-200",
    toggleBg: "bg-gray-200",
    toggleIcon: "text-zinc-700",
    sectionLabel: "text-zinc-400",
  },
}

// ─── Tipos ───────────────────────────────────────────────────────────────────
type BookingWithRelations = Booking & {
  Service: Omit<BarbeshopService, "price"> & { price: number }
  barbershop: Barbershop
}

interface HomeClientProps {
  barbershops: Barbershop[]
  popularBarbershops: Barbershop[]
  confirmedBookings: BookingWithRelations[]
  loading?: boolean
}

// ─── Componente ──────────────────────────────────────────────────────────────
export default function HomeClient({
  barbershops,
  popularBarbershops,
  confirmedBookings,
  loading,
}: HomeClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isDark, setIsDark] = useState(true)

  const t = isDark ? themes.dark : themes.light

  const bookingsToShow =
    confirmedBookings.length > 1
      ? [...confirmedBookings.slice(1), confirmedBookings[0]]
      : confirmedBookings

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <DashRing className="size-14" />
      </div>
    )
  }

  return (
    <motion.div
      className={`min-h-screen transition-colors duration-500 ${t.bg}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <div className="space-y-6 px-6 py-6">

        {/* ── Saudação + Toggle ── */}
        <motion.div
          className="flex items-start justify-between"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <div className="space-y-1">
            <h2 className={`text-xl font-bold ${t.text}`}>
              Olá,{" "}
              <span className="shine-text">
                {session?.user?.name
                  ? `${session.user.name}, reguada hoje?`
                  : "iremos alinhar o cabelo?"}
              </span>
            </h2>
            <p className={`text-sm ${t.textSub}`}>
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>

          {/* Toggle dark/light */}
          <motion.button
            onClick={() => setIsDark((v) => !v)}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full ${t.toggleBg} transition-colors duration-300`}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            aria-label="Alternar tema"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                  transition={{ duration: 0.22 }}
                >
                  <Sun size={18} className={t.toggleIcon} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
                  transition={{ duration: 0.22 }}
                >
                  <Moon size={18} className={t.toggleIcon} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* ── Barra de pesquisa ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
          <SearchBar />
        </motion.div>

        {/* ── Busca rápida ── */}
        <motion.div
          className="flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
        >
          {[
            { src: "/cabeloIcon.png", label: "Cabelo" },
            { src: "/barbarIcon.png", label: "Barba" },
            { src: "/acabamentoIcon.png", label: "Acabamento" },
            { src: "/acabamentoIcon.png", label: "Barberia perto de você" },
            { src: "/acabamentoIcon.png", label: "Luzes" },
          ].map(({ src, label }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                className="cursor-pointer gap-1 p-4 whitespace-nowrap hover:bg-[#C3F32C] hover:text-white"
                variant="secondary"
              >
                <Image src={src} alt={label} width={16} height={16} />
                <span className="ml-2">{label}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Banner ── */}
        <motion.div
          className="relative h-37.5 w-full overflow-hidden rounded-xl"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <Image
            src="/bannerReguaM.png"
            alt="Banner-barberCloud"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="space-y-4">

          {/* ── Agendamentos ── */}
          {confirmedBookings.length > 0 && (
            <>
              <motion.h2
                className={`text-xs font-bold uppercase ${t.sectionLabel}`}
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
                      <CarouselItem key={booking.id} className="pl-2 basis-[90%]">
                        <Card
                          className={`cursor-pointer border transition-colors duration-300 ${t.cardBg} ${t.cardBorder}`}
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
                                <h3 className={`font-semibold ${t.text}`}>
                                  {booking.Service.name}
                                </h3>
                                <span className={`inline-flex items-center gap-1 text-sm ${t.textMuted}`}>
                                  <MapPin size={14} />
                                  <span>{booking.barbershop.name}</span>
                                </span>
                              </div>
                            </div>
                            <div className={`flex flex-col items-center justify-center border-l-2 border-solid px-5 ${t.cardBorder}`}>
                              <p className={`text-sm capitalize ${t.textMuted}`}>
                                {format(new Date(booking.date), "MMMM", { locale: ptBR })}
                              </p>
                              <p className={`text-2xl font-bold ${t.text}`}>
                                {format(new Date(booking.date), "dd")}
                              </p>
                              <p className={`text-sm font-bold ${t.textMuted}`}>
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

          {/* ── Recomendações ── */}
          <motion.h2
            className={`text-xs font-bold uppercase ${t.sectionLabel}`}
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={6}
          >
            Recomendações
          </motion.h2>

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

          {/* ── Populares ── */}
          <motion.h2
            className={`text-xs font-bold uppercase ${t.sectionLabel}`}
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
    </motion.div>
  )
}