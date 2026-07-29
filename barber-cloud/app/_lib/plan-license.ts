import "server-only"

import { createHash, randomBytes } from "node:crypto"

import {
  getPlanDetails,
  type SubscriptionPlanCode,
} from "@/app/_lib/plan-license-config"

const LICENSE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const LICENSE_PATTERN =
  /^RM-(BAS|PRO|PRE)-[A-HJ-NP-Z2-9]{4}(?:-[A-HJ-NP-Z2-9]{4}){3}$/

function createRandomBlock(length: number) {
  const bytes = randomBytes(length)

  return Array.from(bytes, (byte) => {
    return LICENSE_ALPHABET[byte % LICENSE_ALPHABET.length]
  }).join("")
}

export function generatePlanLicenseCode(plan: SubscriptionPlanCode) {
  const prefix = getPlanDetails(plan).prefix
  const blocks = Array.from({ length: 4 }, () => createRandomBlock(4))

  return `RM-${prefix}-${blocks.join("-")}`
}

export function normalizePlanLicenseCode(value: unknown) {
  if (typeof value !== "string") return ""

  return value.trim().toUpperCase().replace(/\s+/g, "")
}

export function isValidPlanLicenseCode(value: string) {
  return LICENSE_PATTERN.test(value)
}

export function hashPlanLicenseCode(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function createLicensePreview(value: string) {
  const [brand, plan, ...blocks] = value.split("-")
  const suffix = blocks.at(-1) ?? ""

  return `${brand}-${plan}-••••-••••-••••-${suffix}`
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

export function normalizeBrazilianWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "")
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`

  return /^55\d{10,11}$/.test(withCountryCode) ? withCountryCode : null
}

