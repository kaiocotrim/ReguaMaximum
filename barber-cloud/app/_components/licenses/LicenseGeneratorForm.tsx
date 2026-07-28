"use client"

import { useActionState, useState } from "react"
import {
  Check,
  Copy,
  KeyRound,
  LoaderCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react"

import {
  generatePlanLicense,
} from "@/app/_actions/planLicenses"
import { PLAN_OPTIONS } from "@/app/_lib/plan-license-config"
import { initialGenerateLicenseState } from "@/app/_lib/plan-license-action-state"

export function LicenseGeneratorForm() {
  const [state, formAction, isPending] = useActionState(
    generatePlanLicense,
    initialGenerateLicenseState,
  )
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const wasCopied =
    Boolean(state.generatedKey) && copiedKey === state.generatedKey

  const copyGeneratedKey = async () => {
    if (!state.generatedKey) return

    await navigator.clipboard.writeText(state.generatedKey)
    setCopiedKey(state.generatedKey)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <form
        action={formAction}
        className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm md:p-7"
      >
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C3F32C]/20">
            <KeyRound className="h-5 w-5 text-[#557500] dark:text-[#C3F32C]" />
          </div>
          <div>
            <h2 className="font-bold text-card-foreground">
              Gerar nova chave
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha o plano e quantos dias o acesso permanecerá ativo.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="plan"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Plano
            </label>
            <select
              id="plan"
              name="plan"
              defaultValue="PRO"
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-[#8fb514] focus:ring-2 focus:ring-[#C3F32C]/20"
            >
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan.value} value={plan.value}>
                  {plan.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="durationDays"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Validade em dias
            </label>
            <input
              id="durationDays"
              name="durationDays"
              type="number"
              min={1}
              max={3650}
              defaultValue={30}
              required
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-[#8fb514] focus:ring-2 focus:ring-[#C3F32C]/20"
            />
          </div>

          <div>
            <label
              htmlFor="customerName"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Nome do cliente
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              maxLength={100}
              placeholder="Ex.: Lucas"
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#8fb514] focus:ring-2 focus:ring-[#C3F32C]/20"
            />
          </div>

          <div>
            <label
              htmlFor="customerPhone"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              WhatsApp
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              maxLength={30}
              placeholder="(11) 99999-9999"
              className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#8fb514] focus:ring-2 focus:ring-[#C3F32C]/20"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-card-foreground"
          >
            Observação
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={500}
            placeholder="Informação interna opcional."
            className="w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#8fb514] focus:ring-2 focus:ring-[#C3F32C]/20"
          />
        </div>

        {state.status === "error" && state.message && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#254F50] px-5 text-sm font-bold text-white transition hover:bg-[#1d4142] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#C3F32C] dark:text-[#111] dark:hover:bg-[#b6e42a]"
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Gerar chave
            </>
          )}
        </button>
      </form>

      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#557500] dark:text-[#C3F32C]">
          Chave recém-gerada
        </p>

        {state.status === "success" && state.generatedKey ? (
          <div className="mt-5">
            <div className="rounded-2xl border border-[#C3F32C]/40 bg-[#C3F32C]/10 p-4">
              <code className="break-all font-mono text-sm font-bold tracking-wide text-[#254F50] dark:text-[#C3F32C]">
                {state.generatedKey}
              </code>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {state.message}
            </p>

            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={copyGeneratedKey}
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold transition hover:border-[#C3F32C]"
              >
                {wasCopied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {wasCopied ? "Chave copiada" : "Copiar chave"}
              </button>

              {state.whatsappUrl && (
                <a
                  href={state.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-white transition hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar pelo WhatsApp
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 text-center">
            <KeyRound className="h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-card-foreground">
              A chave aparecerá aqui
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Ela será mostrada somente no momento da geração.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
