"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { uploadImagem } from "@/app/_lib/uploadImagem"
import {
  addBarbershopPhoto,
  deleteBarbershopPhoto,
} from "@/app/_actions/barbershopPhotos"

interface GalleryPhoto {
  id: string
  imageUrl: string
}

export function BarbershopGalleryManager({
  photos,
  barbershopId,
}: {
  photos: GalleryPhoto[]
  barbershopId: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const upload = async (file?: File) => {
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Use uma imagem JPG, PNG ou WEBP.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.")
      return
    }

    setIsUploading(true)
    try {
      const extension = file.name.split(".").pop() ?? "jpg"
      const url = await uploadImagem(
        file,
        "capas",
        `galeria/${barbershopId}-${Date.now()}.${extension}`,
      )
      const result = await addBarbershopPhoto(url)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("Foto adicionada ao carrossel.")
      router.refresh()
    } catch {
      toast.error("Não foi possível enviar a imagem.")
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const remove = (photoId: string) => {
    startTransition(async () => {
      const result = await deleteBarbershopPhoto(photoId)
      if (result.success) {
        toast.success("Foto removida do carrossel.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Fotos do carrossel</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione até 10 imagens em JPG, PNG ou WEBP, com no máximo 5 MB.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(event) => upload(event.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || photos.length >= 10}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C3F32C] px-4 text-sm font-semibold text-black hover:bg-[#b3e023] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {isUploading ? "Enviando..." : "Adicionar foto"}
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">
            Nenhuma foto adicionada ao carrossel.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted"
            >
              <Image
                src={photo.imageUrl}
                alt={`Foto ${index + 1} do carrossel`}
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(photo.id)}
                disabled={isPending}
                className="absolute top-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                title="Remover foto"
                aria-label="Remover foto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
