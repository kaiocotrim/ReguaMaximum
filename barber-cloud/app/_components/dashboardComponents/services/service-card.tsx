"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

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

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: string | number
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteService(service.id)

        if (!result.success) {
          setIsDialogOpen(false)
          toast.error(result.message)
          return
        }

        setIsDialogOpen(false)
        toast.success("Serviço excluído com sucesso.")
        router.refresh()
      } catch {
        setIsDialogOpen(false)
        toast.error("Não foi possível excluir o serviço.")
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
      }}
      className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800/60
        bg-zinc-950
        transition-colors
        hover:border-zinc-700
      "
    >
      <div className="relative h-32 w-full bg-zinc-900">
        <Image
          src={service.imageUrl || "/placeholder-service.png"}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {service.name}
          </h2>

          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span
            className="
              rounded-full
              bg-[#C3F32C]
              px-2.5
              py-0.5
              text-xs
              font-semibold
              text-black
            "
          >
            R$ {Number(service.price).toFixed(2)}
          </span>

          <div className="flex gap-1.5">
            <Link
              href={`/dashboard/servicos/editar/${service.id}`}
              className="
                rounded-lg
                border
                border-zinc-800
                bg-zinc-900
                p-1.5
                text-zinc-400
                transition-colors
                hover:bg-zinc-800
                hover:text-white
              "
            >
              <Pencil size={14} strokeWidth={2} />
            </Link>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="
                    cursor-pointer
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-1.5
                    text-red-500
                    transition-colors
                    hover:border-red-500/30
                    hover:bg-red-500/10
                  "
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="border-zinc-800 bg-zinc-950">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Excluir serviço
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    Tem certeza que deseja excluir{" "}
                    <span className="font-medium text-zinc-300">
                      {service.name}
                    </span>
                    ? Essa ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer">
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete()
                    }}
                    disabled={isPending}
                    className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin " />
                    ) : (
                      "Excluir"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  )
}