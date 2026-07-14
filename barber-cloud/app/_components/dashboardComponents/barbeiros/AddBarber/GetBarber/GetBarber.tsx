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

import { Card } from "@/app/_components/ui/card"

import { db } from "@/app/_lib/prisma"

import { Button } from "@/app/_components/ui/button"
import { Plus } from "lucide-react"

export default async function GetBarber() {
  const produto = await db.barber.findMany()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="cursor-pointer bg-zinc-800 text-[#C3F32C] hover:bg-zinc-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 border border-zinc-800 bg-[#0d0d0d] shadow-[0_0_0_4px_rgba(195,243,44,0.1)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-white">
            Escolha um barbeiro
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <Card className="mt-5 flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-[#141414] p-6 shadow-sm">
              <ul className="mt-1 flex flex-col divide-y divide-zinc-800">
                {produto.map((p) => (
                  <li
                    key={p.id}
                    className="group flex cursor-pointer items-center justify-between py-3"
                  >
                    <span className="text-sm text-zinc-300 transition-colors group-hover:text-white">
                      {p.nome}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C3F32C] opacity-0 transition-opacity group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            </Card>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction className="bg-[#C3F32C] font-medium text-black hover:bg-[#b3e025]">
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}