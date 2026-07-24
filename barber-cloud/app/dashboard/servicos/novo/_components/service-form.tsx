"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

const inputClasses =
  "w-full rounded-xl border border-zinc-800 dark:bg-zinc-950 px-4 py-3  dark:text-white placeholder:text--600 dark:placeholder:text-zinc-600 outline-none transition-colors focus:border-[#C3F32C]"

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isSubmitting, startSubmitTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    if (isSubmitting) return // trava extra contra cliques simultâneos

    startSubmitTransition(async () => {
      try {
        if (service) {
          await updateService(service.id, formData)
          toast.success("Serviço atualizado com sucesso.")
        } else {
          await createService(formData)
          toast.success("Serviço criado com sucesso.")
        }

        router.push("/dashboard/servicos")
      } catch {
        toast.error("Não foi possível salvar o serviço.")
      }
    })
  }

  function handleDelete() {
    if (!service) return

    startDeleteTransition(async () => {
      const result = await deleteService(service.id)

      if (!result.success) {
        setIsDialogOpen(false)
        toast.error(result.message)
        return
      }

      setIsDialogOpen(false)
      toast.success("Serviço excluído com sucesso.")
      router.push("/dashboard/servicos")
    })
  }

  return (
    <motion.form
      action={handleSubmit}
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border dark:border-zinc-800/60 dark:bg-zinc-950 p-8"
    >
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight dark:text-white">
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
                disabled={isSubmitting}
                className="cursor-pointer flex shrink-0 items-center gap-1.5 rounded-lg border dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} strokeWidth={2} />
                Excluir
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="dark:border-zinc-800 dark:bg-zinc-950">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Excluir serviço</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-500">
                  Tem certeza que deseja excluir{" "}
                  <span className="font-medium text-zinc-300">{service.name}</span>? Essa ação não pode ser
                  desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer dark:border-zinc-800 text-black  dark:text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                  className="bg-red-500 dark:text-white hover:bg-red-600 cursor-pointer"
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
        <label className="mb-2 block text-sm font-medium  text-zinc-400">Nome do Serviço</label>
        <input
          name="name"
          type="text"
          defaultValue={service?.name}
          placeholder="Ex: Corte Degradê"
          className={inputClasses}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
          className={`rounded-xl border border-zinc-800 px-6 py-3 text-sm font-medium dark:text-zinc-300 transition-colors hover:bg-zinc-900 ${
            isSubmitting ? "pointer-events-none opacity-60" : ""
          }`}
        >
          Cancelar
        </Link>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSubmitting}
          className="flex min-w-[140px] items-center justify-center rounded-xl bg-[#C3F32C] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : service ? (
            "Salvar Alterações"
          ) : (
            "Salvar Serviço"
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  )
}