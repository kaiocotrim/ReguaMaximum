"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, Clock, CircleCheckBig } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { de, ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Button } from "@/app/_components/ui/button"
import { METHODS } from "http"

interface AgendBarberProps {
  appointment: {
    id: string
    date: Date
    barbershop: {
      name: string
      imageUrl: string
      address: string
    }
    service: {
      name: string
      price: number
      duration?: number | null
    }
    barber: {
      user: {
        name: string | null
        image: string | null
      }
    }
  }
}

const AgendBarber = ({ appointment }: AgendBarberProps) => {
  const { service, barber, date, barbershop } = appointment
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const isPast = new Date(date) < new Date()
  const dateObj = new Date(date)
  const monthCapitalized = format(dateObj, "MMMM", { locale: ptBR })
  const day = format(dateObj, "dd")
  const fullDate = format(dateObj, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })
  const formattedTime = format(dateObj, "HH:mm")

  async function handleCancel(id: string) {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      console.log("Agendamento cancelado!")
      router.refresh()
    } else {
      console.log("Erro ao cancelar.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          whileHover={{
            scale: 1.015,
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
          whileTap={{ scale: 0.985 }}
          className="flex w-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-transparent backdrop-blur-xl transition-colors duration-200"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4 p-4">
            <motion.div
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white"
              animate={
                !isPast
                  ? {
                      boxShadow: [
                        "0 0 0px #C3F32C00",
                        "0 0 10px #C3F32C55",
                        "0 0 0px #C3F32C00",
                      ],
                    }
                  : {}
              }
              transition={
                !isPast
                  ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                  : {}
              }
            >
              <Image
                src={barbershop.imageUrl}
                alt={barbershop.name}
                fill
                className="object-cover"
              />
            </motion.div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isPast
                    ? "bg-zinc-700 text-white"
                    : "bg-[#C3F32C] text-[#254F50]"
                }`}
              >
                {isPast ? "Finalizado" : "Confirmado"}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="truncate text-[15px] font-semibold tracking-tight text-white"
              >
                {service?.name ?? "Serviço"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <User size={12} className="shrink-0 text-white" />
                <span className="truncate text-[12px] text-white">
                  {barbershop.name}
                </span>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.12, ease: "easeOut" }}
            className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-l border-white/10 px-5"
          >
            <p className="text-[12px] text-zinc-400 capitalize">
              {monthCapitalized}
            </p>
            <motion.p
              className="text-[28px] leading-none font-bold text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            >
              {day}
            </motion.p>
            <p className="text-[12px] font-semibold text-zinc-400">
              {formattedTime}
            </p>
          </motion.div>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-sm overflow-hidden rounded-3xl border-0 bg-zinc-800 p-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero */}
              <motion.div
                className="relative h-44 w-full overflow-hidden rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={barbershop.imageUrl}
                  alt={barbershop.name}
                  fill
                  className="scale-110 object-cover blur-sm"
                />
                <div className="absolute inset-0 bg-black/30" />

                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    isPast
                      ? "bg-black/40 text-white/60 backdrop-blur-md"
                      : "bg-[#C3F32C] text-[#1a3a1a]"
                  }`}
                >
                  {isPast ? (
                    "Finalizado"
                  ) : (
                    <CircleCheckBig
                      size={12}
                      className="h-5 w-5 text-[#1a3a1a]"
                    />
                  )}
                </motion.div>
              </motion.div>

              <div className="-mt-10 flex flex-col items-center gap-4 px-6 pb-8">
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-[#C3F32C] shadow-2xl"
                >
                  {barber.user.image ? (
                    <Image
                      src={barber.user.image}
                      alt={barber.user.name ?? "Barbeiro"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-700">
                      <User size={28} className="text-zinc-400" />
                    </div>
                  )}
                </motion.div>

                {/* Nome + endereço */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.24 }}
                >
                  <p className="text-xl font-semibold tracking-tight text-white">
                    {barbershop.name}
                  </p>
                  {barber?.user?.name && (
                    <p className="mt-0.5 text-[13px] text-zinc-400">
                      {barber.user.name}
                    </p>
                  )}
                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    <MapPin size={11} className="shrink-0 text-zinc-500" />
                    <p className="text-[12px] text-zinc-500">
                      {barbershop.address}
                    </p>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="flex w-full items-center justify-between rounded-3xl bg-white/[0.10] px-5 py-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 }}
                >
                  {[
                    {
                      label: "Preço",
                      value: service.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }),
                    },
                    { label: "Serviço", value: service.name, truncate: true },
                    { label: "Horário", value: formattedTime },
                  ].map((item, i) => (
                    <>
                      {i > 0 && (
                        <div
                          key={`div-${i}`}
                          className="h-8 w-px bg-white/10"
                        />
                      )}
                      <motion.div
                        key={item.label}
                        className="flex flex-col items-center gap-0.5"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.32 + i * 0.07 }}
                      >
                        <span
                          className={`font-semibold text-white ${
                            item.truncate
                              ? "max-w-[80px] truncate text-center text-sm"
                              : "text-base"
                          }`}
                        >
                          {item.value}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {item.label}
                        </span>
                      </motion.div>
                    </>
                  ))}
                </motion.div>

                {/* Data completa */}
                <motion.div
                  className="flex w-full items-center justify-center gap-2 rounded-3xl bg-[#C3F32C] px-5 py-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.44 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Clock size={13} className="shrink-0 text-[#254F50]" />
                  <span className="text-[12px] text-[#254F50] capitalize">
                    {fullDate}
                  </span>
                </motion.div>
                <Button
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl bg-red-500 px-5 py-5 text-white hover:bg-red-700"
                  onClick={() => handleCancel(appointment.id)}
                >
                  Cancelar agendamento
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default AgendBarber
