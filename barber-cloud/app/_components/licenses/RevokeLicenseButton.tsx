"use client"

import { Ban } from "lucide-react"

import { revokePlanLicense } from "@/app/_actions/planLicenses"

export function RevokeLicenseButton({ licenseId }: { licenseId: string }) {
  return (
    <form
      action={revokePlanLicense}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Deseja revogar esta licença? Uma barbearia vinculada poderá perder o acesso.",
          )
        ) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="licenseId" value={licenseId} />
      <button
        type="submit"
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/20 px-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-300"
      >
        <Ban className="h-3.5 w-3.5" />
        Revogar
      </button>
    </form>
  )
}

