"use client"

import { Pencil } from "lucide-react"

import { BarbershopBrandImagesEditor } from "@/app/_components/dashboardComponents/BarbershopBrandImagesEditor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { cn } from "@/app/_lib/utils"

export function BarbershopBrandImagesDialog({
  imageUrl,
  coverUrl,
  target,
  className,
}: {
  imageUrl: string
  coverUrl: string | null
  target: "logo" | "cover"
  className?: string
}) {
  const label =
    target === "logo" ? "Alterar foto de perfil" : "Alterar foto de capa"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={label}
          title={label}
          className={cn(
            "flex size-9 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95",
            target === "logo"
              ? "border-white bg-[#C3F32C] text-black"
              : "border-white/20 bg-black/60 text-white hover:bg-black/75",
            className,
          )}
        >
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto p-5 sm:max-w-3xl sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar fotos da barbearia</DialogTitle>
          <DialogDescription>
            Anexe uma imagem ou use uma URL para atualizar a logo e a capa.
          </DialogDescription>
        </DialogHeader>
        <BarbershopBrandImagesEditor
          imageUrl={imageUrl}
          coverUrl={coverUrl}
          embedded
        />
      </DialogContent>
    </Dialog>
  )
}
