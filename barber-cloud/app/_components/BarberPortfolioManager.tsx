"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus, Loader2, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { uploadImagem } from "@/app/_lib/uploadImagem"
import {
  addBarberPortfolioPhoto,
  deleteBarberPortfolioPhoto,
  updateBarberPortfolio,
} from "@/app/_actions/barberPortfolio"

interface PortfolioPhoto {
  id: string
  imageUrl: string
}

export function BarberPortfolioManager({
  barber,
}: {
  barber: {
    id: string
    name: string
    bio: string
    city: string
    specialties: string[]
    photos: PortfolioPhoto[]
    avatar: string | null
  }
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(barber.avatar)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const save = (formData: FormData) => {
    startTransition(async () => {
      let image: string | undefined
      if (avatarFile) {
        const extension = avatarFile.name.split(".").pop() ?? "jpg"
        image = await uploadImagem(
          avatarFile,
          "logos",
          `avatars/barbeiro-${barber.id}-${Date.now()}.${extension}`,
        )
      }
      const result = await updateBarberPortfolio({
        name: String(formData.get("name") ?? ""),
        bio: String(formData.get("bio") ?? ""),
        city: String(formData.get("city") ?? ""),
        specialties: String(formData.get("specialties") ?? "").split(","),
        image,
      })
      if (result.success) {
        toast.success("Portfólio atualizado.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

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
        `portfolio/${barber.id}-${Date.now()}.${extension}`,
      )
      const result = await addBarberPortfolioPhoto(url)
      if (result.success) {
        toast.success("Trabalho adicionado ao portfólio.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Não foi possível enviar a imagem.")
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const remove = (photoId: string) => {
    startTransition(async () => {
      const result = await deleteBarberPortfolioPhoto(photoId)
      if (result.success) {
        toast.success("Foto removida.")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <form action={save} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <h2 className="font-semibold">Informações profissionais</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Estes dados aparecerão para os clientes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#C3F32C] bg-muted">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Foto do barbeiro"
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(event) => {
                const selected = event.target.files?.[0]
                if (!selected) return
                if (selected.size > 5 * 1024 * 1024) {
                  toast.error("A imagem deve ter no máximo 5 MB.")
                  return
                }
                setAvatarFile(selected)
                setAvatarPreview(URL.createObjectURL(selected))
              }}
            />
          </label>
          <p className="text-xs text-muted-foreground">
            Clique para trocar sua foto profissional.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Nome profissional</span>
          <input name="name" required defaultValue={barber.name} className="h-10 rounded-lg border border-border bg-background px-3" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Cidade</span>
          <input name="city" defaultValue={barber.city} className="h-10 rounded-lg border border-border bg-background px-3" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Especialidades</span>
          <input
            name="specialties"
            defaultValue={barber.specialties.join(", ")}
            placeholder="Degradê, barba, social..."
            className="h-10 rounded-lg border border-border bg-background px-3"
          />
          <span className="text-xs text-muted-foreground">Separe por vírgulas.</span>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Sobre o seu trabalho</span>
          <textarea
            name="bio"
            defaultValue={barber.bio}
            maxLength={1000}
            rows={6}
            className="resize-none rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C3F32C] text-sm font-semibold text-black hover:bg-[#b3e023] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Salvando..." : "Salvar informações"}
        </button>
      </form>

      <div>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Fotos dos seus serviços</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione até 5 trabalhos ao seu portfólio.
            </p>
          </div>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => upload(event.target.files?.[0])} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading || barber.photos.length >= 5}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-accent disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {isUploading ? "Enviando..." : "Adicionar trabalho"}
          </button>
        </div>

        {barber.photos.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Nenhuma foto adicionada ao portfólio.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {barber.photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                <Image src={photo.imageUrl} alt="Trabalho do barbeiro" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => remove(photo.id)}
                  disabled={isPending}
                  className="absolute top-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Remover foto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
