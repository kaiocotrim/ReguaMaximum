"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, Clock, CircleCheckBig } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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

// ─── Variantes reutilizáveis ──────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const fadeX = (x = -10, delay = 0) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.32, delay, ease: "easeOut" as const },
})

const popIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.72, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// ─── Componente ───────────────────────────────────────────────────────────────

const AgendBarber = ({ appointment }: AgendBarberProps) => {
  const { service, barber, date, barbershop } = appointment
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const isPast = new Date(date) < new Date()
  const dateObj = new Date(date)
  const monthCapitalized = format(dateObj, "MMM", { locale: ptBR })
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
      router.refresh()
      setOpen(false)
    }
  }

  const stats = [
    {
      label: "Preço",
      value: service.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    },
    { label: "Serviço", value: service.name, truncate: true },
    { label: "Horário", value: formattedTime },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ════════════════════════════════════════════
          CARD TRIGGER
      ════════════════════════════════════════════ */}
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          whileHover={{
            scale: 1.012,
          }}
          whileTap={{ scale: 0.984 }}
          className="flex w-full cursor-pointer overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-xl transition-colors duration-200 hover:bg-accent/40"
        >
          {/* Lado esquerdo */}
          <div className="flex min-w-0 flex-1 items-center gap-4 p-4">
            {/* Avatar com glow pulsante */}
            <motion.div
              className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 border-border"
              animate={
                !isPast
                  ? {
                      boxShadow: [
                        "0 0 0px rgba(195,243,44,0)",
                        "0 0 14px rgba(195,243,44,0.45)",
                        "0 0 0px rgba(195,243,44,0)",
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

            {/* Infos textuais */}
            <div className="flex min-w-0 flex-col gap-1.5">
              {/* Badge status */}
              <motion.div {...fadeX(-8, 0.08)}>
                <div
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10px] font-bold tracking-wide ${
                    isPast
                      ? "bg-muted text-muted-foreground"
                      : "bg-[#C3F32C] text-[#1d3d1e]"
                  }`}
                >
                  {!isPast && (
                    <motion.span
                      className="h-[5px] w-[5px] rounded-full bg-[#1d3d1e]"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {isPast ? "Finalizado" : "Confirmado"}
                </div>
              </motion.div>

              {/* Nome do serviço */}
              <motion.p
                {...fadeUp(0.14)}
                className="truncate text-[14px] font-semibold tracking-tight text-foreground"
              >
                {service?.name ?? "Serviço"}
              </motion.p>

              {/* Nome da barbearia */}
              <motion.div
                {...fadeUp(0.19)}
                className="flex items-center gap-1.5"
              >
                <User size={11} className="shrink-0 text-muted-foreground" />
                <span className="truncate text-[11px] text-muted-foreground">
                  {barbershop.name}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Lado direito — data */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.1, ease: "easeOut" }}
            className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-l border-border px-5"
          >
            <motion.p
              {...fadeUp(0.16)}
              className="text-[11px] text-muted-foreground capitalize"
            >
              {monthCapitalized}
            </motion.p>

            <motion.p
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[26px] leading-none font-bold text-foreground"
            >
              {day}
            </motion.p>

            <motion.p
              {...fadeUp(0.25)}
              className="text-[11px] font-medium text-muted-foreground"
            >
              {formattedTime}
            </motion.p>
          </motion.div>
        </motion.div>
      </DialogTrigger>

      {/* ════════════════════════════════════════════
          MODAL
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-sm overflow-hidden rounded-[28px] border-0 bg-card p-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Hero image ── */}
              <motion.div
                className="relative h-44 w-full overflow-hidden rounded-[22px]"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <Image
                  src={barbershop.imageUrl}
                  alt={barbershop.name}
                  fill
                  className="scale-110 object-cover blur-sm"
                />
                {/* overlay sobre a foto — mantido em preto, é uma camada de contraste sobre imagem */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Badge no hero */}
                <motion.div
                  {...fadeX(-12, 0.15)}
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    isPast
                      ? "bg-black/50 text-white/80 backdrop-blur-md"
                      : "bg-[#C3F32C] text-[#1a3a1a]"
                  }`}
                >
                  {!isPast && (
                    <CircleCheckBig size={13} className="text-[#1a3a1a]" />
                  )}
                  {isPast ? "Finalizado" : "Confirmado"}
                </motion.div>
              </motion.div>

              {/* ── Body ── */}
              <div className="-mt-10 flex flex-col items-center gap-4 px-5 pb-8">
                {/* Avatar do barbeiro */}
                <motion.div
                  {...popIn(0.18)}
                  className="relative h-20 w-20 overflow-hidden rounded-full border-[3px] border-[#C3F32C] shadow-2xl"
                >
                  {barber.user.image ? (
                    <Image
                      src={barber.user.image}
                      alt={barber.user.name ?? "Barbeiro"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <User size={26} className="text-muted-foreground" />
                    </div>
                  )}
                </motion.div>

                {/* Nome + barbeiro + endereço */}
                <motion.div {...fadeUp(0.24)} className="text-center">
                  <p className="text-[18px] font-semibold tracking-tight text-foreground">
                    {barbershop.name}
                  </p>

                  {barber?.user?.name && (
                    <motion.p
                      {...fadeUp(0.28)}
                      className="mt-0.5 text-[13px] text-muted-foreground"
                    >
                      {barber.user.name}
                    </motion.p>
                  )}

                  <motion.div
                    {...fadeUp(0.31)}
                    className="mt-1.5 flex items-center justify-center gap-1.5"
                  >
                    <MapPin size={11} className="shrink-0 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground">
                      {barbershop.address}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Stats — preço / serviço / horário */}
                <motion.div
                  {...fadeUp(0.3)}
                  className="flex w-full items-center justify-around rounded-[20px] bg-muted px-4 py-4"
                >
                  {stats.map((item, i) => (
                    <div key={item.label} className="flex items-center">
                      {i > 0 && (
                        <motion.div
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.34 + i * 0.06 }}
                          className="mx-3 h-8 w-px bg-border"
                        />
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.32 + i * 0.07 }}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <span
                          className={`font-semibold text-foreground ${
                            item.truncate
                              ? "max-w-[72px] truncate text-center text-[13px]"
                              : "text-[15px]"
                          }`}
                        >
                          {item.value}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.label}
                        </span>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>

                {/* Pill de data completa */}
                <motion.div
                  {...fadeUp(0.42)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#C3F32C] px-5 py-3"
                >
                  <Clock size={13} className="shrink-0 text-[#254F50]" />
                  <span className="text-[12px] font-semibold text-[#254F50] capitalize">
                    {fullDate}
                  </span>
                </motion.div>

                {/* ── AlertDialog de cancelamento ── */}
                {!isPast && (
                  <motion.div {...fadeUp(0.5)} className="w-full">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <motion.button
                          whileHover={{
                            scale: 1.01,
                            backgroundColor: "rgba(239,68,68,0.12)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full rounded-[18px] border border-red-500/20 bg-red-500/[0.06] py-3 text-[13px] font-semibold text-red-500 transition-colors duration-200 cursor-pointer"
                        >
                          Cancelar agendamento
                        </motion.button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="rounded-[24px] border-0 bg-card p-6">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <AlertDialogHeader>
                            <motion.div {...fadeUp(0.05)}>
                              <AlertDialogTitle className="text-[17px] font-semibold text-foreground">
                                Cancelar agendamento?
                              </AlertDialogTitle>
                            </motion.div>
                            <motion.div {...fadeUp(0.1)}>
                              <AlertDialogDescription className="text-[13px] text-muted-foreground">
                                Essa ação não pode ser desfeita. O horário
                                ficará disponível para outros clientes.
                              </AlertDialogDescription>
                            </motion.div>
                          </AlertDialogHeader>

                          <motion.div {...fadeUp(0.15)}>
                            <AlertDialogFooter className="mt-5 flex gap-2">
                              <AlertDialogCancel className="flex-1 cursor-pointer rounded-[14px] border border-border bg-muted text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground">
                                Voltar
                              </AlertDialogCancel>

                              <AlertDialogAction asChild>
                                <motion.button
                                  whileHover={{
                                    scale: 1.02,
                                    backgroundColor: "#dc2626",
                                  }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleCancel(appointment.id)}
                                  className="flex-1 cursor-pointer rounded-[14px] bg-red-500 p-0.5 text-[13px] font-semibold text-white transition-colors duration-150"
                                >
                                  Sim, cancelar
                                </motion.button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </motion.div>
                        </motion.div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default AgendBarber