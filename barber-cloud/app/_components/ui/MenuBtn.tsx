"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./avatar"

import { Button } from "./button"

import {
  CalendarCheck2,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  LogOut,
  Menu,
  ScissorsLineDashed,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils" // já vem com o shadcn


interface MenuBtnProps {
  className?: string
}

const MenuBtn = ({ className }: MenuBtnProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={className ?? "text-white hover:bg-black/10"} // 👈 aqui
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto border-l border-[#C3F32C]/20 bg-black px-6 text-white backdrop-blur-xl">
        <SheetHeader className="mt-6">
          <div className="space-y-1 text-left">
            <SheetTitle className="text-4xl font-black leading-tight tracking-tight text-white">
              Vai deixar o cabelo
              <br />
              na{" "}
              <span className="text-[#C3F32C] drop-shadow-[0_0_8px_#C3F32C]">
                régua?
              </span>
            </SheetTitle>

            <SheetDescription className="pt-1 text-base text-zinc-400">
              Régua{" "}
              <span className="font-semibold text-[#C3F32C]">Máxima.</span>
            </SheetDescription>
          </div>

          <div className="flex justify-center pt-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#C3F32C]/30 blur-3xl" />

              <Avatar className="relative h-52 w-52 border-[3px] border-[#C3F32C] shadow-[0_0_30px_#C3F32C50]">
                <AvatarImage
                  src="https://media.licdn.com/dms/image/v2/D4D03AQGYK5d8AjYKbw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1681474715614?e=1780531200&v=beta&t=JZmlZBjRfsOGiT9LymYKntOZca5q8n4AmoD1lIbrNF4"
                  alt="@shadcn"
                  className="object-cover "
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#C3F32C]/30 bg-zinc-950 px-4 py-2 shadow-lg">
                <Crown className="h-4 w-4 text-[#C3F32C]" />
                <span className="text-xs font-semibold tracking-widest text-[#C3F32C]">
                  VIP
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center">
            <h1 className="text-3xl font-bold text-white">
              Fala,{" "}
              <span className="text-[#C3F32C] drop-shadow-[0_0_10px_#C3F32C]">
                Bruno
              </span>
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Gerencie sua barbearia com precisão.
            </p>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-[#C3F32C]" />
              <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
                Menu
              </h1>
            </div>

            <div className="space-y-4">
              <Button className="group h-20 w-full rounded-3xl border border-zinc-800 bg-zinc-950 px-5 hover:border-[#C3F32C]/40 hover:bg-zinc-900">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3F32C]/20 bg-[#C3F32C]/10">
                      <CalendarCheck2 className="h-7 w-7 text-[#C3F32C]" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-white">Agendar</h2>
                      <p className="text-sm text-zinc-500">Marque seus horários</p>
                    </div>
                  </div>
                  {/* <ChevronRight className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-[#C3F32C]"/> */}
                </div>
              </Button>

              <Button className="group h-20 w-full rounded-3xl border border-zinc-800 bg-zinc-950 px-5 hover:border-[#C3F32C]/40 hover:bg-zinc-900">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3F32C]/20 bg-[#C3F32C]/10">
                      <ScissorsLineDashed className="h-7 w-7 text-[#C3F32C]" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-white">Serviços</h2>
                      <p className="text-sm text-zinc-500">Gerencie seus serviços</p>
                    </div>
                  </div>
                  {/* <ChevronRight className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-[#C3F32C]" /> */}
                </div>
              </Button>

              <Button className="group h-20 w-full rounded-3xl border border-zinc-800 bg-zinc-950 px-5 hover:border-[#C3F32C]/40 hover:bg-zinc-900">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3F32C]/20 bg-[#C3F32C]/10">
                      <Heart className="h-7 w-7 text-[#C3F32C]" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-white">Favoritos</h2>
                      <p className="text-sm text-zinc-500">Seus favoritos</p>
                    </div>
                  </div>
                  {/* <ChevronRight className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-[#C3F32C]" /> */}
                </div>
              </Button>

              <Button className="group h-20 w-full rounded-3xl border border-zinc-800 bg-zinc-950 px-5 hover:border-[#C3F32C]/40 hover:bg-zinc-900">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3F32C]/20 bg-[#C3F32C]/10">
                      <Clock className="h-7 w-7 text-[#C3F32C]" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-white">Histórico</h2>
                      <p className="text-sm text-zinc-500">Veja seu progresso</p>
                    </div>
                  </div>
                  {/* <ChevronRight className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-[#C3F32C]" /> */}
                </div>
              </Button>

              <Button className="group h-20 w-full rounded-3xl border border-zinc-800 bg-zinc-950 px-5 hover:border-[#C3F32C]/40 hover:bg-zinc-900">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3F32C]/20 bg-[#C3F32C]/10">
                      <Settings className="h-7 w-7 text-[#C3F32C]" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-white">Configurações</h2>
                      <p className="text-sm text-zinc-500">Ajustes da conta</p>
                    </div>
                  </div>
                  {/* <ChevronRight className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-[#C3F32C]" /> */}
                </div>
              </Button>
            </div>
          </div>

          <Button className="mt-8 h-20 w-full rounded-3xl border border-[#C3F32C]/40 bg-transparent hover:bg-[#C3F32C]/10">
            <div className="flex items-center gap-4">
              <LogOut className="h-7 w-7 text-[#C3F32C]" />
              <div className="text-left">
                <h2 className="text-lg font-semibold text-[#C3F32C]">Sair da conta</h2>
                <p className="text-sm text-zinc-500">Até logo!</p>
              </div>
            </div>
          </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default MenuBtn