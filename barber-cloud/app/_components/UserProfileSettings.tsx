"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Camera, Loader2, Save, User } from "lucide-react"
import { toast } from "sonner"
import { uploadImagem } from "@/app/_lib/uploadImagem"
import { updateUserProfile } from "@/app/_actions/updateUserProfile"

export function UserProfileSettings({
  initial,
}: {
  initial: { name: string; phone: string; image: string | null; userId: string }
}) {
  const [preview, setPreview] = useState(initial.image)
  const [file, setFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()

  const submit = (formData: FormData) => {
    startTransition(async () => {
      try {
        let image: string | undefined
        if (file) {
          const extension = file.name.split(".").pop() ?? "jpg"
          image = await uploadImagem(
            file,
            "logos",
            `avatars/${initial.userId}-${Date.now()}.${extension}`,
          )
        }
        const result = await updateUserProfile({
          name: String(formData.get("name")),
          phone: String(formData.get("phone")),
          image,
        })
        if (result.success) {
          toast.success("Perfil atualizado.")
        } else {
          toast.error(result.error)
        }
      } catch {
        toast.error("Não foi possível atualizar o perfil.")
      }
    })
  }

  return (
    <form action={submit} className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-semibold">Informações do perfil</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Atualize sua foto e seus dados pessoais.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#C3F32C] bg-muted">
          {preview ? (
            <Image src={preview} alt="Foto do perfil" fill sizes="96px" className="object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(event) => {
              const selected = event.target.files?.[0]
              if (!selected) return
              if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
                toast.error("Use uma imagem JPG, PNG ou WEBP.")
                return
              }
              if (selected.size > 5 * 1024 * 1024) {
                toast.error("A imagem deve ter no máximo 5 MB.")
                return
              }
              setFile(selected)
              setPreview(URL.createObjectURL(selected))
            }}
          />
        </label>
        <div>
          <p className="text-sm font-medium">Foto da conta</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clique na foto para substituir.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Nome</span>
          <input name="name" defaultValue={initial.name} required className="h-10 rounded-lg border border-border bg-background px-3" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Telefone</span>
          <input name="phone" defaultValue={initial.phone} required className="h-10 rounded-lg border border-border bg-background px-3" />
        </label>
      </div>

      <button type="submit" disabled={isPending} className="mt-5 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C3F32C] px-4 text-sm font-semibold text-black disabled:opacity-50">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isPending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  )
}
