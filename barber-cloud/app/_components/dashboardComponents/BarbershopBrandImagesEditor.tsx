"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { ImageIcon, ImagePlus, Link2, Loader2, Save, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateBarbershopBrandImages } from "@/app/_actions/barbershopSettings"
import { Button } from "@/app/_components/ui/button"
import { Card } from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { uploadImagem } from "@/app/_lib/uploadImagem"

type ImageMode = "upload" | "url"

function validateFile(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use uma imagem JPG, PNG ou WEBP.")
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 5 MB.")
  }
}

function ImageSourceField({
  title,
  description,
  purpose,
  aspectClass,
  value,
  mode,
  file,
  onValueChange,
  onModeChange,
  onFileChange,
  disabled,
}: {
  title: string
  description: string
  purpose: "barbershop-logo" | "barbershop-cover"
  aspectClass: string
  value: string
  mode: ImageMode
  file: File | null
  onValueChange: (value: string) => void
  onModeChange: (mode: ImageMode) => void
  onFileChange: (file: File | null) => void
  disabled: boolean
}) {
  const filePreview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  )
  useEffect(
    () => () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    },
    [filePreview],
  )
  const preview = filePreview || value

  return (
    <Card className="min-w-0 gap-4 rounded-2xl p-4 sm:p-5">
      <div>
        <div className="flex items-center gap-2">
          {purpose === "barbershop-logo" ? (
            <UserRound className="size-4" />
          ) : (
            <ImageIcon className="size-4" />
          )}
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className={`${aspectClass} relative overflow-hidden rounded-xl border bg-muted`}
      >
        {preview ? (
          // A prévia precisa aceitar blob local e URL ainda não salva.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={`Prévia da ${title.toLowerCase()}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImagePlus className="size-8 opacity-40" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => onModeChange("upload")}
          className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg text-xs font-semibold ${
            mode === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <ImagePlus className="size-4" />
          Anexar foto
        </button>
        <button
          type="button"
          onClick={() => onModeChange("url")}
          className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg text-xs font-semibold ${
            mode === "url"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Link2 className="size-4" />
          Usar URL
        </button>
      </div>

      {mode === "upload" ? (
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          className="h-10 cursor-pointer"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null
            if (!nextFile) return
            try {
              validateFile(nextFile)
              onFileChange(nextFile)
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Arquivo inválido.",
              )
              event.target.value = ""
            }
          }}
        />
      ) : (
        <Input
          type="url"
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value)
            onFileChange(null)
          }}
          placeholder="https://exemplo.com/imagem.jpg"
          disabled={disabled}
          className="h-10"
        />
      )}
      <p className="text-[11px] text-muted-foreground">
        JPG, PNG ou WEBP · máximo de 5 MB.
      </p>
    </Card>
  )
}

export function BarbershopBrandImagesEditor({
  imageUrl: initialImageUrl,
  coverUrl: initialCoverUrl,
  embedded = false,
}: {
  imageUrl: string
  coverUrl: string | null
  embedded?: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [logoMode, setLogoMode] = useState<ImageMode>("url")
  const [coverMode, setCoverMode] = useState<ImageMode>("url")
  const [logoUrl, setLogoUrl] = useState(initialImageUrl)
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl ?? "")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const save = () => {
    startTransition(async () => {
      try {
        let finalLogoUrl = logoUrl.trim()
        let finalCoverUrl = coverUrl.trim()

        if (logoMode === "upload" && logoFile) {
          finalLogoUrl = await uploadImagem(logoFile, {
            purpose: "barbershop-logo",
          })
        }
        if (coverMode === "upload" && coverFile) {
          finalCoverUrl = await uploadImagem(coverFile, {
            purpose: "barbershop-cover",
          })
        }
        if (!finalLogoUrl) {
          toast.error("Adicione uma foto de perfil.")
          return
        }

        const result = await updateBarbershopBrandImages({
          imageUrl: finalLogoUrl,
          coverUrl: finalCoverUrl,
        })
        if (!result.success) {
          toast.error(result.error)
          return
        }

        setLogoUrl(finalLogoUrl)
        setCoverUrl(finalCoverUrl)
        setLogoFile(null)
        setCoverFile(null)
        setLogoMode("url")
        setCoverMode("url")
        toast.success("Fotos da barbearia atualizadas.")
        router.refresh()
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar as fotos.",
        )
      }
    })
  }

  return (
    <section className={embedded ? "mt-2" : "mt-5"}>
      {!embedded && (
        <div className="mb-4">
          <h2 className="font-semibold">Fotos principais</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Essas imagens aparecem no perfil público e nos cards da barbearia.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ImageSourceField
          title="Foto de perfil"
          description="Use uma imagem quadrada, como seu logotipo."
          purpose="barbershop-logo"
          aspectClass="mx-auto aspect-square w-full max-w-56"
          value={logoUrl}
          mode={logoMode}
          file={logoFile}
          onValueChange={setLogoUrl}
          onModeChange={setLogoMode}
          onFileChange={setLogoFile}
          disabled={pending}
        />
        <ImageSourceField
          title="Foto de capa"
          description="Use uma imagem horizontal que represente o ambiente."
          purpose="barbershop-cover"
          aspectClass="aspect-[16/7] w-full"
          value={coverUrl}
          mode={coverMode}
          file={coverFile}
          onValueChange={setCoverUrl}
          onModeChange={setCoverMode}
          onFileChange={setCoverFile}
          disabled={pending}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          onClick={save}
          disabled={pending}
          className="bg-[#C3F32C] font-bold text-black hover:bg-[#afd925]"
        >
          {pending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save />
          )}
          {pending ? "Salvando fotos..." : "Salvar fotos"}
        </Button>
      </div>
    </section>
  )
}
