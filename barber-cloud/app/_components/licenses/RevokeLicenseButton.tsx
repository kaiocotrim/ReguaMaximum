"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Ban, Loader2, ShieldAlert } from "lucide-react"

import { revokePlanLicense } from "@/app/_actions/planLicenses"
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

export function RevokeLicenseButton({ licenseId }: { licenseId: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRevoke = () => {
    setError("")

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.set("licenseId", licenseId)
        await revokePlanLicense(formData)
        setOpen(false)
        router.refresh()
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Não foi possível revogar a licença.",
        )
      }
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) setOpen(nextOpen)
        if (nextOpen) setError("")
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/20 px-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-300"
        >
          <Ban className="h-3.5 w-3.5" />
          Revogar
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[420px] gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card p-0 text-card-foreground shadow-2xl ring-0 dark:border-white/10">
        <div className="h-1 w-full bg-red-500" />

        <div className="p-6 sm:p-7">
          <AlertDialogHeader className="place-items-start gap-0 text-left">
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <ShieldAlert className="size-5 text-red-600 dark:text-red-400" />
            </div>

            <AlertDialogTitle className="text-lg font-semibold tracking-tight text-foreground">
              Revogar esta licença?
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-left text-sm leading-6 text-muted-foreground">
              A licença será desativada imediatamente. Se estiver vinculada a
              uma barbearia, ela poderá perder o acesso aos recursos do plano.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-xs leading-5 text-red-700 dark:text-red-300">
            Essa ação não pode ser desfeita. Para liberar o acesso novamente,
            será necessário gerar uma nova licença.
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <AlertDialogFooter className="mt-6 !-mx-0 !-mb-0 !flex-row !justify-end gap-2 border-0 bg-transparent p-0">
            <AlertDialogCancel
              disabled={isPending}
              className="h-10 cursor-pointer rounded-xl border-border bg-background px-4 text-foreground hover:bg-muted"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                handleRevoke()
              }}
              disabled={isPending}
              className="h-10 cursor-pointer rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revogando...
                </>
              ) : (
                "Revogar licença"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
