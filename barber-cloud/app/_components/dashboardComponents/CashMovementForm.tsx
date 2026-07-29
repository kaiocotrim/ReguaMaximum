"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import type {
  CashMovementType,
  PaymentMethod,
} from "@/app/generated/prisma/client"
import { createCashMovement } from "@/app/_actions/cashMovement"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"

export function CashMovementForm() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCashMovement({
        type: String(formData.get("type")) as CashMovementType,
        amount: Number(String(formData.get("amount")).replace(",", ".")),
        description: String(formData.get("description")),
        method: String(formData.get("method")) as PaymentMethod,
      })
      if (result.success) {
        toast.success("Movimentação registrada.")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#C3F32C] px-4 text-sm font-semibold text-black hover:bg-[#b3e023]">
          <PlusCircle className="h-4 w-4" />
          Nova movimentação
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Registrar movimentação</DialogTitle>
          <DialogDescription>
            Use para entradas e saídas que não vieram de atendimentos.
          </DialogDescription>
        </DialogHeader>
        <form action={submit} className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Tipo</span>
            <select name="type" className="h-10 rounded-lg border border-border bg-background px-3">
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Descrição</span>
            <input name="description" required maxLength={120} placeholder="Ex.: Compra de produtos" className="h-10 rounded-lg border border-border bg-background px-3" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Valor</span>
              <input name="amount" type="number" min="0.01" step="0.01" required className="h-10 rounded-lg border border-border bg-background px-3" />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Forma</span>
              <select name="method" defaultValue="PIX" className="h-10 rounded-lg border border-border bg-background px-3">
                <option value="PIX">Pix</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="CARTAO_CREDITO">Crédito</option>
                <option value="CARTAO_DEBITO">Débito</option>
                <option value="OUTRO">Outro</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={isPending} className="h-11 cursor-pointer rounded-xl bg-[#C3F32C] text-sm font-semibold text-black disabled:opacity-50">
            {isPending ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
