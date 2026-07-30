import "server-only"

import { createHash, createHmac } from "node:crypto"
export { getPasswordValidationError } from "./password-policy"

const EMAIL_MAX_LENGTH = 254
const RESET_TOKEN_PATTERN = /^[a-f0-9]{64}$/

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

export function isValidEmail(email: string) {
  return (
    email.length > 0 &&
    email.length <= EMAIL_MAX_LENGTH &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
}

export function isValidResetToken(token: unknown): token is string {
  return typeof token === "string" && RESET_TOKEN_PATTERN.test(token)
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function createPasswordVersion(passwordHash: string | null) {
  const secret = process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET não configurada")
  }

  return createHmac("sha256", secret)
    .update(passwordHash ?? "oauth-only-account")
    .digest("base64url")
}
