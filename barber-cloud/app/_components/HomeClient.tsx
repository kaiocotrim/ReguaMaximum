"use client"

import { DashRing } from "@/app/_components/dash-ring";

import Image from "next/image"
import { Button } from "@/app/_components/ui/button"
import Header from "./header"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarImage } from "./ui/avatar"
import BarbershopItem from "./barbershop-item"
import SearchBar from "./SearchBar"
import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Barbershop } from "@prisma/client"
import { useSession } from "next-auth/react"

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
interface HomeClientProps {
  barbershops: Barbershop[]
  popularBarbershops: Barbershop[]
  loading?: boolean
}

export default function HomeClient({
  barbershops,
  popularBarbershops,
  loading,
}: HomeClientProps) {
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
          return <DashRing className="size-14" />;

      </div>
    )
  }

  const { data: session } = useSession()

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
                ? `${session.user.name}, reguada hoje?`
                : "iremos alinhar o cabelo?"}
            </span>
          </h2>
          <p className="text-sm text-gray-500">Segunda-feira, 12 de junho</p>
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
          className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden"
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

        {/* Banner */}
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

        {/* Agendamentos */}
        <div className="space-y-4">
          <motion.h2
            className="text-xs font-bold uppercase"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={4}
          >
            Agendado
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
          >
            <Card className="cursor-pointer hover:bg-black">
              <CardContent className="flex justify-between p-0">
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
                <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                  <p className="text-sm">Maio</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm font-bold">16:00</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recomendações */}
          <motion.h2
            className="text-xs font-bold uppercase"
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
