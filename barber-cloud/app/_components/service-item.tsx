"use client"

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

import { Scissors } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"

const ServiceItem = ({ service }: ServiceItemProps) => {
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

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="sm"
                variant="default"
                className="ml-auto justify-center rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 hover:bg-[#d4ff3a] hover:shadow-[0_0_12px_rgba(195,243,44,0.5)]"
              >
                Agendar
              </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col overflow-y-auto border-l border-white/[0.08] bg-[#111111]/95 px-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
              <SheetHeader className="mt-8 space-y-0">

              </SheetHeader>

              <div className="mt-6 h-px w-full bg-white/[0.05]" />

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3 px-1">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#333] uppercase">
                    Escolha o dia
                  </span>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>

                <div className="rounded-2xl border border-white/[0.05] bg-[#1a1a1a] p-3">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    classNames={{
                      months: "w-full",
                      month: "w-full space-y-2",
                      table: "w-full border-collapse",
                      head_row: "grid grid-cols-7",
                      head_cell:
                        "text-[10px] font-bold tracking-widest text-[#444] uppercase text-center",
                      row: "grid grid-cols-7 mt-1",
                      cell: "relative p-0 text-center text-sm flex items-center justify-center",
                      day: "h-9 w-full rounded-xl text-[#aaa] transition-all hover:bg-[#C3F32C]/10 hover:text-[#C3F32C]",
                      day_selected: "!bg-[#C3F32C] !text-black font-bold",
                      day_today: "border border-[#C3F32C]/30 text-[#C3F32C]",
                      day_outside: "text-[#2a2a2a]",
                      day_disabled: "text-[#2a2a2a] cursor-not-allowed",
                      nav: "flex items-center gap-1",
                      nav_button:
                        "h-8 w-8 rounded-xl border border-white/[0.05] bg-[#1f1f1f] text-white transition-all hover:border-[#C3F32C]/30 hover:bg-[#C3F32C]/10 hover:text-[#C3F32C]",
                      caption: "flex justify-center pb-2 relative items-center",
                      caption_label:
                        "text-sm font-bold text-white capitalize tracking-wide",
                    }}
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3 px-1">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#333] uppercase">
                    Horário
                  </span>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
              </div>
              <div className="mt-auto border-t border-white/[0.05] pt-4 pb-6">
                <button className="w-full rounded-xl bg-[#C3F32C] py-3 text-sm font-black text-black transition-all hover:bg-[#d4ff3a] hover:shadow-[0_0_20px_rgba(195,243,44,0.3)]">
                  Confirmar Agendamento
                </button>
              </div>
            </SheetContent>
          </Sheet>
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
