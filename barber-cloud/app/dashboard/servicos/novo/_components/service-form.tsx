"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, AlertTriangle, CheckCircle2, Trash2, X } from "lucide-react"

import { createService } from "@/app/_actions/service/create-service"
import { updateService } from "@/app/_actions/service/update-service"
import { deleteService } from "@/app/_actions/service/delete-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"

type ServiceFormProps = {
  service?: {
    id: string
    name: string
    description: string
    price: any
    duration: number
    imageUrl: string
  }
}

type Toast = {
  id: string
  message: string
  variant: "error" | "success"
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

const inputClasses =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-[#C3F32C]"

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [toasts, setToasts] = useState<Toast[]>([])

  function showToast(message: string, variant: Toast["variant"] = "error") {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleSubmit(formData: FormData) {
    try {
      if (service) {
        await updateService(service.id, formData)
        showToast("Serviço atualizado com sucesso.", "success")
      } else {
        await createService(formData)
        showToast("Serviço criado com sucesso.", "success")
      }
    } catch {
      showToast("Não foi possível salvar o serviço.")
    }
  }

  function handleDelete() {
    if (!service) return

    startDeleteTransition(async () => {
      const result = await deleteService(service.id)

      if (!result.success) {
        setIsDialogOpen(false)
        showToast(result.message)
        return
      }

      setIsDialogOpen(false)
      showToast("Serviço excluído com sucesso.", "success")
      router.push("/dashboard/servicos")
    })
  }

  return (
    <>
      <motion.form
        action={handleSubmit}
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-8"
      >
        <motion.div variants={item} className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {service ? "Editar Serviço" : "Novo Serviço"}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              {service ? "Altere as informações do serviço." : "Cadastre um novo serviço para sua barbearia."}
            </p>
          </div>

          {service && (
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10"
                >
                  <Trash2 size={14} strokeWidth={2} />
                  Excluir
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="border-zinc-800 bg-zinc-950">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Excluir serviço</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    Tem certeza que deseja excluir{" "}
                    <span className="font-medium text-zinc-300">{service.name}</span>? Essa ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete()
                    }}
                    disabled={isDeleting}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </motion.div>

        {/* Nome */}
        <motion.div variants={item}>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Nome do Serviço</label>
          <input
            name="name"
            type="text"
            defaultValue={service?.name}
            placeholder="Ex: Corte Degradê"
            className={inputClasses}
            required
          />
        </motion.div>

        {/* Descrição */}
        <motion.div variants={item}>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Descrição</label>
          <textarea
            name="description"
            defaultValue={service?.description}
            rows={4}
            placeholder="Descreva o serviço..."
            className={`${inputClasses} resize-none`}
            required
          />
        </motion.div>

        {/* Preço e duração */}
        <motion.div variants={item} className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Preço</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                R$
              </span>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={service?.price?.toString()}
                placeholder="0,00"
                className={`${inputClasses} pl-11`}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Duração</label>
            <div className="relative">
              <input
                name="duration"
                type="number"
                min="1"
                defaultValue={service?.duration}
                placeholder="Tempo em minutos"
                className={`${inputClasses} pr-14`}
                required
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                min
              </span>
            </div>
          </div>
        </motion.div>

        {/* Botões */}
        <motion.div variants={item} className="flex justify-end gap-3 pt-2">
          <Link
            href="/dashboard/servicos"
            className="rounded-xl border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
          >
            Cancelar
          </Link>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="rounded-xl bg-[#C3F32C] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023]"
          >
            {service ? "Salvar Alterações" : "Salvar Serviço"}
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Toasts — canto inferior direito */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = toast.variant === "success" ? CheckCircle2 : AlertTriangle
            const styles =
              toast.variant === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`pointer-events-auto flex items-start gap-2 rounded-xl border p-3 text-sm shadow-lg backdrop-blur ${styles}`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="flex-1">{toast.message}</p>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
                  aria-label="Fechar alerta"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}