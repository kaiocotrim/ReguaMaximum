"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"


import { createBooking } from "@/app/_lib/create-booking"
import { BarbeshopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"



interface ServiceItemProps {
  service: Omit<BarbeshopService, "price"> & {
    price: number
  }
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
]

const BARBER_LIST = [
  { id: "1", name: "Carlos Silva", specialty: "Corte & Barba" },
  { id: "2", name: "Diego Rocha", specialty: "Degradê" },
  { id: "3", name: "Mateus Lima", specialty: "Navalhado" },
  { id: "4", name: "Rafael Souza", specialty: "Corte Clássico" },
]

const ServiceItem = ({ service }: ServiceItemProps) => {
  // 🔵 Estado tipado como Date | undefined (não null) para compatibilidade com o Calendar
  const [selectDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    // 🔵 Ao trocar a data, reseta hora e barbeiro
    setSelectedTime(null)
    setSelectedBarber(null)
  }

  const handleReset = () => {
    setSelectedDay(undefined)
    setSelectedTime(null)
    setSelectedBarber(null)
  }

const handleBooking = async () => {
  if (!selectDay || !selectedTime || !selectedBarber) return

  const [hours, minutes] = selectedTime.split(":")

  const bookingDate = new Date(selectDay)

  bookingDate.setHours(Number(hours))
  bookingDate.setMinutes(Number(minutes))
  bookingDate.setSeconds(0)

  await createBooking({
    userId: session?.user.id!,
    barbershopId,
    serviceId: service.id,
    barberId: selectedBarber,
    date: bookingDate,
  })
}
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/80 p-3 backdrop-blur-sm transition-all duration-300 duration-500 hover:-translate-y-0.5 hover:border-[#C3F32C]/30 hover:shadow-[0_0_20px_rgba(195,243,44,0.08)]">
      {/* Imagem do serviço */}
      <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px] overflow-hidden rounded-xl">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-xl border-2 border-[#C3F32C]/40 object-cover transition-transform duration-700 hover:scale-110"
        />
        {/* Brilho sutil na imagem ao hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
      </div>

      {/* Direita: nome, descrição, preço e botão */}
      <div className="flex-1 space-y-2 pr-2">
        <h3 className="animate-in fade-in slide-in-from-left-2 text-base font-bold tracking-wide text-[#C3F32C] delay-100">
          {service.name}
        </h3>
        <p className="animate-in fade-in line-clamp-2 text-xs leading-relaxed text-zinc-400 delay-150">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <p className="animate-in fade-in text-lg font-bold text-white delay-200">
            R${" "}
            <span className="animate-pulse text-[#C3F32C] [animation-duration:3s]">
              {service.price.toFixed(2)}
            </span>
          </p>

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                size="sm"
                className="relative ml-auto cursor-pointer justify-center overflow-hidden rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:scale-105 hover:bg-[#d4ff3a] hover:shadow-[0_0_16px_rgba(195,243,44,0.6)] hover:before:translate-x-full active:scale-95"
              >
                Agendar
              </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-[#111111] text-white">
              <DrawerHeader>
                <DrawerTitle className="animate-in fade-in slide-in-from-top-2 text-white">
                  Agende seu horário
                </DrawerTitle>
              </DrawerHeader>

              {!(selectDay && selectedTime) && (
                <>
                  <div className="animate-in fade-in zoom-in-95 flex justify-center p-4 duration-300">
                    <Calendar
                      className="w-fit rounded-xl bg-[#111111] p-3"
                      mode="single"
                      locale={ptBR}
                      selected={selectDay}
                      onSelect={handleDateSelect}
                      classNames={{
                        cell: "h-9 w-9 text-center text-sm p-0 relative cursor-pointer",

                        caption_label: "text-[#C3F32C] font-bold",

                        head_cell: "text-[#C3F32C] font-semibold",

                        day: "text-white hover:bg-[#C3F32C] hover:text-[#254F50] rounded-md cursor-pointer",

                        day_selected:
                          "!bg-[#C3F32C] !text-[#254F50] hover:!bg-[#C3F32C] hover:!text-[#254F50] cursor-pointer",

                        day_today: "!bg-[#254F50] !text-[#C3F32C] rounded-md",

                        nav_button:
                          "text-[#C3F32C] hover:bg-[#254F50] rounded-md",
                      }}
                    />
                  </div>

                  <div
                    data-vaul-no-drag
                    className="animate-in fade-in slide-in-from-bottom-2 flex gap-4 overflow-auto p-5 pb-10 pl-10 delay-150 duration-400 [&::-webkit-scrollbar]:hidden"
                  >
                    {TIME_LIST.map((time, i) => (
                      <Button
                        key={time}
                        variant={
                          selectedTime === time ? "default" : "secondary"
                        }
                        onClick={() => setSelectedTime(time)}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className={`animate-in fade-in slide-in-from-bottom-2 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                          selectedTime === time
                            ? "scale-105 bg-[#C3F32C] text-[#254F50] shadow-[0_0_12px_rgba(195,243,44,0.4)]"
                            : "hover:border-[#C3F32C]/40"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {selectDay && selectedTime && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <div className="mx-5 mb-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition-all duration-300 hover:ring-[#C3F32C]/20">
                    <div>
                      <p className="text-xs text-white/50">Data e horário</p>
                      <p className="text-sm font-semibold text-white">
                        {selectDay.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                        })}{" "}
                        às {selectedTime}
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="cursor-pointer text-xs text-[#C3F32C] underline underline-offset-2 transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
                    >
                      Trocar
                    </button>
                  </div>

                  <p className="pb-2 pl-10 text-sm font-semibold text-white/60">
                    Escolha o barbeiro
                  </p>

                  <div
                    data-vaul-no-drag
                    className="flex gap-4 overflow-auto pt-2 pr-5 pb-6 pl-10 [&::-webkit-scrollbar]:hidden"
                  >
                    {BARBER_LIST.map((barber, i) => {
                      const isSelected = selectedBarber === barber.id
                      const initials = barber.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)

                      return (
                        <button
                          key={barber.id}
                          onClick={() => setSelectedBarber(barber.id)}
                          style={{ animationDelay: `${i * 60}ms` }}
                          className={`animate-in fade-in slide-in-from-bottom-3 flex min-w-[120px] cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
                            isSelected
                              ? "scale-105 border-[#C3F32C] bg-[#C3F32C]/10 shadow-[0_0_16px_rgba(195,243,44,0.3)]"
                              : "border-white/10 bg-white/5 hover:border-white/30"
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                              isSelected
                                ? "bg-[#C3F32C] text-[#254F50] shadow-[0_0_10px_rgba(195,243,44,0.5)]"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {initials}
                          </div>
                          <span className="text-center text-xs leading-tight font-semibold text-white">
                            {barber.name}
                          </span>
                          <span className="text-center text-[10px] text-white/50">
                            {barber.specialty}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectDay && selectedTime && selectedBarber && (
                <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 p-5 pt-1 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <Button
                    onClick={handleBooking}
                    className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-[#C3F32C] font-bold text-[#254F50] transition-transform duration-150 after:absolute after:inset-0 after:-translate-x-full after:[animation:shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              )}

              <DrawerFooter className="pt-0">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-95"
                  >
                    Fechar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
