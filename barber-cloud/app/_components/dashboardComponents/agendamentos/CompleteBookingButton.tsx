"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { PaymentMethod } from "@/app/generated/prisma/client"
import { completeBookingWithPayment } from "@/app/_actions/completeBookingWithPayment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"

export function CompleteBookingButton({
  bookingId,
  clientName,
  serviceName,
  servicePrice,
  onSuccess,
}: {
  bookingId: string
  clientName: string
  serviceName: string
  servicePrice: number
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const submit = (formData: FormData) => {
    const amount = Number(String(formData.get("amount")).replace(",", "."))
    const method = String(formData.get("method")) as PaymentMethod

    startTransition(async () => {
      const result = await completeBookingWithPayment({
        bookingId,
        method,
        amount,
      })
      if (result.success) {
        toast.success("Atendimento finalizado e pagamento registrado.")
        setOpen(false)
        onSuccess?.()
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C3F32C] text-sm font-semibold text-black hover:bg-[#b3e023]"
        >
          <CheckCircle2 className="h-4 w-4" />
          Finalizar atendimento
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle>Finalizar atendimento e receber</DialogTitle>
          <DialogDescription>
            {clientName} · {serviceName}. Após finalizar, o cliente poderá avaliar
            o atendimento.
          </DialogDescription>
        </DialogHeader>
        <form action={submit} className="mt-2 grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Forma de pagamento</span>
            <select
              name="method"
              defaultValue="PIX"
              className="h-10 rounded-lg border border-border bg-background px-3"
            >
              <option value="PIX">Pix</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="CARTAO_CREDITO">Cartão de crédito</option>
              <option value="CARTAO_DEBITO">Cartão de débito</option>
              <option value="OUTRO">Outro</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Valor recebido</span>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={servicePrice.toFixed(2)}
              className="h-10 rounded-lg border border-border bg-background px-3"
            />
          </label>
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            O atendimento será marcado como concluído, o comparecimento será
            confirmado e a avaliação será liberada para o cliente.
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C3F32C] text-sm font-semibold text-black hover:bg-[#b3e023] disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Finalizando..." : "Confirmar recebimento"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
