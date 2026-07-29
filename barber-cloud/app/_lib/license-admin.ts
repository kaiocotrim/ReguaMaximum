import "server-only"

import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { normalizeEmail } from "@/app/_lib/auth-security"
import { db } from "@/app/_lib/prisma"

function getConfiguredAdminEmails() {
  return new Set(
    (process.env.LICENSE_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  )
}

export function isPublicLicenseGeneratorEnabled() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.LICENSE_PUBLIC_GENERATOR === "true"
  )
}

export function isLicenseAdminAccount(user: {
  email: string | null
  isLicenseAdmin: boolean
}) {
  const email = normalizeEmail(user.email)
  const configuredAdminEmails = getConfiguredAdminEmails()

  return (
    user.isLicenseAdmin ||
    (email.length > 0 && configuredAdminEmails.has(email))
  )
}

export async function getLicenseAdminUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      isLicenseAdmin: true,
    },
  })

  if (!user) return null

  return isLicenseAdminAccount(user) ? user : null
}
