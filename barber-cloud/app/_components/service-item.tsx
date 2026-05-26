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
            <SheetTrigger>
              <Button
                size="sm"
                variant="default"
                className="ml-auto justify-center rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 hover:bg-[#d4ff3a] hover:shadow-[0_0_12px_rgba(195,243,44,0.5)]"
              >
                Agendar
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Agendar</SheetTitle>
                <SheetDescription>
                  <p>Calendario</p>
                </SheetDescription>
              </SheetHeader>
              <Calendar mode="single"  locale={ptBR} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
