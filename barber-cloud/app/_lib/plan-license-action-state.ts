export type GenerateLicenseState = {
  status: "idle" | "error" | "success"
  message?: string
  generatedKey?: string
  whatsappUrl?: string | null
}

export type ActivateLicenseState = {
  status: "idle" | "error"
  message?: string
}

export const initialGenerateLicenseState: GenerateLicenseState = {
  status: "idle",
}

export const initialActivateLicenseState: ActivateLicenseState = {
  status: "idle",
}

