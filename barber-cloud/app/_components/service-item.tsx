"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

import { BarbeshopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet"

interface ServiceItemProps {
  service: Omit<BarbeshopService, "price"> & {
    price: number
  }
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { setDay } from "date-fns"

import { Scissors } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"

const ServiceItem = ({ service }: ServiceItemProps) => {
  const [selectDay, setSelectedDay] = useState<Date | null>(null)

  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
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
  ]

  return (
    <div className="mb-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/80 p-3 backdrop-blur-sm transition-all duration-300 hover:border-[#C3F32C]/30 hover:shadow-[0_0_20px_rgba(195,243,44,0.08)]">
      {/* Exibir imagem do serviço */}
      <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px] overflow-hidden rounded-xl">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-xl border-2 border-[#C3F32C]/40 object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Direita do item: nome e preço */}
      <div className="flex-1 space-y-2 pr-2">
        <h3 className="text-base font-bold tracking-wide text-[#C3F32C]">
          {service.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {service.description}
        </p>

        {/* Exibir preço do serviço */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-white">
            R${" "}
            <span className="text-[#C3F32C]">{service.price.toFixed(2)}</span>
          </p>
          {/* <Sheet>
            <SheetTrigger asChild></SheetTrigger>

            <SheetContent className="flex flex-col overflow-y-auto border-l border-white/[0.08] bg-[#111111] px-5 text-white">
              <SheetHeader className="mt-5 space-y-0">
                <SheetTitle className="text-left text-lg font-black text-white">
                  Fazer <span className="text-[#C3F32C]">Reserva</span>
                </SheetTitle>
                <SheetDescription className="text-left text-xs text-[#555]">
                  Selecione o dia e horário para sua reserva.
                </SheetDescription>
              </SheetHeader>
              <hr />
              <div className="">
                <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-[#555] uppercase">
                  Escolha o dia
                </p>
                
              </div>

              <div className="mt-6">
                <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-[#555] uppercase">
                  Horário
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {TIME_LIST.map((time) => (
                    <button
                      key={time}
                      className="flex h-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-[#1a1a1a] px-4 text-xs font-semibold text-[#aaa] transition-all hover:border-[#C3F32C]/30 hover:bg-[#C3F32C]/10 hover:text-[#C3F32C]"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-white/[0.05] pt-4 pb-6">
                <button className="w-full rounded-xl bg-[#C3F32C] py-3 text-sm font-black text-black transition-all hover:bg-[#d4ff3a] hover:shadow-[0_0_20px_rgba(195,243,44,0.3)]">
                  Confirmar Agendamento
                </button>
              </div>
            </SheetContent>
          </Sheet> */}

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                size="sm"
                variant="default"
                className="ml-auto justify-center rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 hover:bg-[#d4ff3a] hover:shadow-[0_0_12px_rgba(195,243,44,0.5)]"
              >
                Agendar
              </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-[#111111] text-white">
              <DrawerHeader>
                <DrawerTitle className="text-white">
                  Agende seu horario
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex justify-center p-4">
                <Calendar
                  className="w-fit bg-[#111111]"
                  mode="single"
                  locale={ptBR}
                  selected={selectDay}
                  onSelect={handleDateSelect}
                />
              </div>

              <div>
                <div className="flex gap-4 overflow-auto p-5 pb-10 pl-10 [&::-webkit-scrollbar]:hidden">
                  {TIME_LIST.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "secondary"}
                      onClick={() => setSelectedTime(time)}
                      className={
                        selectedTime === time ? "bg-[#C3F32C] text-[#254F50]" : ""
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              {selectDay && selectedTime && (
                <div className="">
                  <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 p-5 px-5 pt-1 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <Button className="relative w-full overflow-hidden rounded-lg bg-[#C3F32C] font-bold text-[#254F50]">
                      Confirmar Agendamento
                    </Button>
                  </div>
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

// <Sheet>
//   <SheetTrigger>
//     <Button
//       size="sm"
//       variant="default"
//       className="ml-auto justify-center rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 hover:bg-[#d4ff3a] hover:shadow-[0_0_12px_rgba(195,243,44,0.5)]"
//     >
//       Agendar
//     </Button>
//   </SheetTrigger>
//   <SheetContent className="flex flex-col overflow-y-auto border-l border-white/[0.08] bg-[#111111]/95 px-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
//     <SheetHeader>
//       <SheetTitle>Fazer Reserva</SheetTitle>
//       <SheetDescription>
//         Reserve seu corte para ficar na régua!
//       </SheetDescription>
//     </SheetHeader>
//     <Calendar
//       mode="single"
//       locale={ptBR}
//       classNames={{
//         table: " border-collapse",

//         head_row: "flex",
//         head_cell:
//           " rounded-md text-sm font-medium text-zinc-400 capitalize",

//         row: "mt-2 flex ",

//         cell: "relative h-10  p-0 text-center text-sm",

//         day: "h-10 w-10 rounded-xl text-white transition hover:bg-[#C3F32C] hover:text-black",

//         day_selected:
//           "bg-[#C3F32C] text-black hover:bg-[#d4ff3a] hover:text-black",

//         nav: "flex items-center gap-1",

//         nav_button:
//           "h-8 w-8 rounded-md border border-white/10 bg-zinc-900 text-white hover:bg-zinc-800",

//         caption:
//           "flex justify-center pt-1 relative items-center text-white capitalize",

//         caption_label: "text-sm font-semibold text-white",
//       }}
//     />
//   </SheetContent>
// </Sheet>
