"use client"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, Scissors, Clock,Check,CircleCheckBig } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/_components/ui/dialog"

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

  const isPast = new Date(date) < new Date()
  const dateObj = new Date(date)

  const monthCapitalized = format(dateObj, "MMMM", { locale: ptBR })
  const day = format(dateObj, "dd")
  const fullDate = format(dateObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  const formattedTime = format(dateObj, "HH:mm")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Card com entrada suave + hover elevado */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          whileHover={{ scale: 1.015, backgroundColor: "rgba(255,255,255,0.07)" }}
          whileTap={{ scale: 0.985 }}
          className="w-full rounded-2xl border border-white/10 bg-transparent backdrop-blur-xl overflow-hidden flex cursor-pointer transition-colors duration-200"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0 p-4">
            {/* Avatar com pulse suave se confirmado */}
            <motion.div
              className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shrink-0"
              animate={!isPast ? { boxShadow: ["0 0 0px #C3F32C00", "0 0 10px #C3F32C55", "0 0 0px #C3F32C00"] } : {}}
              transition={!isPast ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : {}}
            >
              <Image src={barbershop.imageUrl} alt={barbershop.name} fill className="object-cover" />
            </motion.div>

            <div className="flex flex-col gap-1.5 min-w-0">
              {/* Badge com entrada */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
                  isPast ? "bg-zinc-700 text-white" : "bg-[#C3F32C] text-[#254F50]"
                }`}
              >
                {isPast ? "Finalizado" : "Confirmado"}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-white text-[15px] font-semibold tracking-tight truncate"
              >
                {service?.name ?? "Serviço"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <User size={12} className="text-white shrink-0" />
                <span className="text-[12px] text-white truncate">{barbershop.name}</span>
              </motion.div>
            </div>
          </div>

          {/* Bloco de data */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.12, ease: "easeOut" }}
            className="flex flex-col items-center justify-center border-l border-white/10 px-5 shrink-0 gap-0.5"
          >
            <p className="text-[12px] text-zinc-400 capitalize">{monthCapitalized}</p>
            <motion.p
              className="text-[28px] font-bold text-white leading-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            >
              {day}
            </motion.p>
            <p className="text-[12px] font-semibold text-zinc-400">{formattedTime}</p>
          </motion.div>
        </motion.div>
      </DialogTrigger>

      {/* Dialog com AnimatePresence para entrada/saída suave */}
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-sm rounded-3xl border-0 bg-zinc-800 p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero */}
              <motion.div
                className="relative w-full h-44 rounded-b-3xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Image src={barbershop.imageUrl} alt={barbershop.name} fill className="object-cover blur-sm scale-110" />
                <div className="absolute inset-0 bg-black/30" />

                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${
                    isPast
                      ? "bg-black/40 text-white/60 backdrop-blur-md"
                      : "bg-[#C3F32C] text-[#1a3a1a]"
                  }`}
                >
                  
                  {isPast ? "Finalizado" : <CircleCheckBig size={12} className="text-[#1a3a1a] w-5 h-5" />}
                </motion.div>
              </motion.div>

              <div className="flex flex-col items-center -mt-10 px-6 pb-8 gap-4">
                {/* Avatar do barbeiro */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#C3F32C] shadow-2xl"
                >
                  {barber.user.image ? (
                    <Image src={barber.user.image} alt={barber.user.name ?? "Barbeiro"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
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
                  <p className="text-white text-xl font-semibold tracking-tight">{barbershop.name}</p>
                  {barber?.user?.name && (
                    <p className="text-zinc-400 text-[13px] mt-0.5">{barber.user.name}</p>
                  )}
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <MapPin size={11} className="text-zinc-500 shrink-0" />
                    <p className="text-zinc-500 text-[12px]">{barbershop.address}</p>
                  </div>
                </motion.div>

                {/* Bloco de stats: preço / serviço / horário com stagger */}
                <motion.div
                  className="w-full flex items-center justify-between bg-white/[0.10] rounded-2xl px-5 py-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 }}
                >
                  {[
                    {
                      label: "Preço",
                      value: service.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    },
                    { label: "Serviço", value: service.name, truncate: true },
                    { label: "Horário", value: formattedTime },
                  ].map((item, i) => (
                    <>
                      {i > 0 && <div key={`div-${i}`} className="w-px h-8 bg-white/10" />}
                      <motion.div
                        key={item.label}
                        className="flex flex-col items-center gap-0.5"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.32 + i * 0.07 }}
                      >
                        <span className={`text-white font-semibold ${item.truncate ? "text-sm truncate max-w-[80px] text-center" : "text-base"}`}>
                          {item.value}
                        </span>
                        <span className="text-zinc-400 text-[11px]">{item.label}</span>
                      </motion.div>
                    </>
                  ))}
                </motion.div>

                {/* Data completa */}
                <motion.div
                  className="w-full flex items-center justify-center gap-2 bg-[#C3F32C] rounded-2xl px-5 py-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.44 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Clock size={13} className="text-[#254F50] shrink-0" />
                  <span className="text-[#254F50] text-[12px] capitalize">{fullDate}</span>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default AgendBarber