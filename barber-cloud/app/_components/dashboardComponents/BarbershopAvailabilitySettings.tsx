"use client"

import { useState, useTransition } from "react"
import { CalendarCheck, CalendarX, LoaderCircle } from "lucide-react"

import { updateBarbershopBookingAvailability } from "@/app/_actions/barbershopSettings"
import { Switch } from "@/app/_components/ui/switch"

export function BarbershopAvailabilitySettings({
  initialEnabled,
}: {
  initialEnabled: boolean
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleChange(nextEnabled: boolean) {
    const previousEnabled = enabled
    setEnabled(nextEnabled)
    setError("")

    startTransition(async () => {
      const result =
        await updateBarbershopBookingAvailability(nextEnabled)

      if (!result.success) {
        setEnabled(previousEnabled)
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border p-4 transition-colors ${
          enabled
            ? "border-emerald-500/25 bg-emerald-500/10"
            : "border-amber-500/25 bg-amber-500/10"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              enabled
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            }`}
          >
            {enabled ? (
              <CalendarCheck className="h-5 w-5" />
            ) : (
              <CalendarX className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">
                  {enabled
                    ? "Agendamentos liberados"
                    : "Agendamentos pausados"}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {enabled
                    ? "Clientes podem visualizar horários e fazer novos agendamentos."
                    : "A barbearia continua visível, mas nenhum cliente consegue marcar novos horários."}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isPending && (
                  <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Switch
                  checked={enabled}
                  disabled={isPending}
                  onCheckedChange={handleChange}
                  aria-label={
                    enabled
                      ? "Pausar novos agendamentos"
                      : "Liberar novos agendamentos"
                  }
                  className="data-checked:bg-[#8fb514]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Essa opção não cancela os horários já marcados. Você pode reativar os
        agendamentos a qualquer momento.
      </p>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  )
}
