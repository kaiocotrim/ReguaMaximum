"use client"

import { useActionState } from "react"
import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react"

import {
  activatePlanLicense,
} from "@/app/_actions/planLicenses"
import { initialActivateLicenseState } from "@/app/_lib/plan-license-action-state"

export function LicenseActivationForm({
  isRenewal = false,
}: {
  isRenewal?: boolean
}) {
  const [state, formAction, isPending] = useActionState(
    activatePlanLicense,
    initialActivateLicenseState,
  )

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="licenseKey"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Chave de liberação
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 transition-colors focus-within:border-[#8fb514] focus-within:ring-2 focus-within:ring-[#C3F32C]/20 dark:focus-within:border-[#C3F32C]">
          <KeyRound className="h-5 w-5 shrink-0 text-[#71910d] dark:text-[#C3F32C]" />
          <input
            id="licenseKey"
            name="licenseKey"
            type="text"
            required
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="RM-PRO-XXXX-XXXX-XXXX-XXXX"
            className="h-14 min-w-0 flex-1 bg-transparent font-mono text-sm uppercase tracking-wide text-foreground outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground/55"
          />
        </div>
      </div>

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C3F32C] px-5 text-sm font-bold text-[#254F50] transition hover:bg-[#b6e42a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Validando chave...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            {isRenewal ? "Renovar plano" : "Validar e criar barbearia"}
          </>
        )}
      </button>
    </form>
  )
}
