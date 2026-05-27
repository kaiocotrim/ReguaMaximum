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
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
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

  return (
    <div className="mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/80 p-3 backdrop-blur-sm transition-all duration-300 hover:border-[#C3F32C]/30 hover:shadow-[0_0_20px_rgba(195,243,44,0.08)]">
      {/* Imagem do serviço */}
      <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px] overflow-hidden rounded-xl">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-xl border-2 border-[#C3F32C]/40 object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Direita: nome, descrição, preço e botão */}
      <div className="flex-1 space-y-2 pr-2">
        <h3 className="text-base font-bold tracking-wide text-[#C3F32C]">
          {service.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-white">
            R${" "}
            <span className="text-[#C3F32C]">{service.price.toFixed(2)}</span>
          </p>

          {/* 🔵 Drawer corretamente estruturado com Trigger + Content dentro do <Drawer> */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                size="sm"
                className="ml-auto justify-center rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 hover:bg-[#d4ff3a] hover:shadow-[0_0_12px_rgba(195,243,44,0.5)]"
              >
                Agendar
              </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-[#111111] text-white">
              <DrawerHeader>
                <DrawerTitle className="text-white">
                  Agende seu horário
                </DrawerTitle>
              </DrawerHeader>

              {/* Calendário + horários — somem após data e hora escolhidos */}
              {!(selectDay && selectedTime) && (
                <>
                  <div className="flex justify-center p-4">
                    <Calendar
                      className="w-fit bg-[#111111]"
                      mode="single"
                      locale={ptBR}
                      selected={selectDay}
                      onSelect={handleDateSelect}
                    />
                  </div>

                  <div
                    data-vaul-no-drag
                    className="flex gap-4 overflow-auto p-5 pb-10 pl-10 [&::-webkit-scrollbar]:hidden"
                  >
                    {TIME_LIST.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "secondary"}
                        onClick={() => setSelectedTime(time)}
                        className={
                          selectedTime === time
                            ? "bg-[#C3F32C] text-[#254F50]"
                            : ""
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              {/* Cards de barbeiro — aparecem após data + hora */}
              {selectDay && selectedTime && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  {/* Resumo com botão de trocar */}
                  <div className="mx-5 mb-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
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
                      className="text-xs text-[#C3F32C] underline underline-offset-2"
                    >
                      Trocar
                    </button>
                  </div>

                  <p className="pb-2 pl-10 text-sm font-semibold text-white/60">
                    Escolha o barbeiro
                  </p>

                  <div
                    data-vaul-no-drag
                    className="flex gap-4 overflow-auto pb-6 pl-10 pr-5 [&::-webkit-scrollbar]:hidden"
                  >
                    {BARBER_LIST.map((barber) => {
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
                          className={`flex min-w-[120px] flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                            isSelected
                              ? "border-[#C3F32C] bg-[#C3F32C]/10 shadow-[0_0_12px_rgba(195,243,44,0.25)]"
                              : "border-white/10 bg-white/5 hover:border-white/30"
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                              isSelected
                                ? "bg-[#C3F32C] text-[#254F50]"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {initials}
                          </div>
                          <span className="text-center text-xs font-semibold leading-tight text-white">
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

              {/* Botão confirmar — só após os 3 campos preenchidos */}
              {selectDay && selectedTime && selectedBarber && (
                <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 p-5 pt-1 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <Button className="relative w-full overflow-hidden rounded-lg bg-[#C3F32C] font-bold text-[#254F50]">
                    Confirmar Agendamento
                  </Button>
                </div>
              )}

              <DrawerFooter className="pt-0">
                <DrawerClose asChild>
                  <Button variant="outline">Fechar</Button>
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