import "server-only"

import bcrypt from "bcrypt"

import { db } from "@/app/_lib/prisma"
import { isValidEmail, normalizeEmail } from "@/app/_lib/auth-security"
import { PASSWORD_MAX_BYTES } from "@/app/_lib/password-policy"

const DUMMY_PASSWORD_HASH =
  "$2b$12$/A1pv8xc9p9v9lJX92P/q.maUQ55FuvpfUbOhKWRF6YrEGGWgcbNy"

export type PasswordAuthenticatedUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: "CLIENT" | "BARBER" | null
  password: string
}

export async function verifyPasswordCredentials(
  emailInput: unknown,
  passwordInput: unknown,
): Promise<PasswordAuthenticatedUser | null> {
  const email = normalizeEmail(emailInput)
  const password = typeof passwordInput === "string" ? passwordInput : ""

  if (
    !isValidEmail(email) ||
    password.length === 0 ||
    Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES
  ) {
    return null
  }

  try {
    const user = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
      },
    })

    const passwordMatches = await bcrypt.compare(
      password,
      user?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (!user?.password || !passwordMatches) {
      return null
    }

    return {
      ...user,
      password: user.password,
    }
  } catch (error) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH).catch(() => false)
    throw error
  }
}
