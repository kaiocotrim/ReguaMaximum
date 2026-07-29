import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { db } from "@/app/_lib/prisma"
import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {
  createPasswordVersion,
  isValidEmail,
  normalizeEmail,
} from "@/app/_lib/auth-security"
import {
  consumeRateLimit,
  getClientIp,
} from "@/app/_lib/server-rate-limit"

const DUMMY_PASSWORD_HASH =
  "$2b$12$/A1pv8xc9p9v9lJX92P/q.maUQ55FuvpfUbOhKWRF6YrEGGWgcbNy"

function logAuthFailure(context: string, error: unknown) {
  const errorRecord =
    error && typeof error === "object"
      ? (error as Record<string, unknown>)
      : null

  console.error(`[auth] ${context}`, {
    name:
      error instanceof Error
        ? error.name
        : errorRecord?.constructor?.name ?? "UnknownError",
    message:
      error instanceof Error
        ? error.message
        : typeof errorRecord?.message === "string"
          ? errorRecord.message
          : String(error),
    type:
      typeof errorRecord?.type === "string"
        ? errorRecord.type
        : undefined,
  })
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, request) {
        const email = normalizeEmail(credentials?.email)
        const password = credentials?.password
        const rateLimit = consumeRateLimit({
          namespace: "credentials-login",
          identifier: getClientIp(request.headers ?? {}),
          limit: 10,
          windowMs: 15 * 60 * 1000,
        })

        if (
          !rateLimit.allowed ||
          !isValidEmail(email) ||
          typeof password !== "string" ||
          password.length === 0 ||
          Buffer.byteLength(password, "utf8") > 72
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

          const passwordMatch = await bcrypt.compare(
            password,
            user?.password ?? DUMMY_PASSWORD_HASH,
          )

          if (!user?.password || !passwordMatch) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          await bcrypt.compare(password, DUMMY_PASSWORD_HASH).catch(() => false)
          logAuthFailure("Falha ao validar as credenciais", error)
          return null
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }

      if (token.sub) {
        let userFromDb

        try {
          userFromDb = await db.user.findUnique({
            where: { id: token.sub },
            select: {
              role: true,
              name: true,
              image: true,
              password: true,
            },
          })
        } catch (error) {
          logAuthFailure("Falha ao validar a sessão", error)
          throw new Error("Não foi possível validar a sessão.")
        }

        if (!userFromDb) {
          throw new Error("Sessão inválida.")
        }

        const passwordVersion = createPasswordVersion(userFromDb.password)

        if (!user && !token.passwordVersion) {
          throw new Error("Sessão inválida.")
        }

        if (
          !user &&
          token.passwordVersion &&
          token.passwordVersion !== passwordVersion
        ) {
          throw new Error("Sessão inválida.")
        }

        token.passwordVersion = passwordVersion
        token.role = userFromDb?.role
        token.name = userFromDb?.name
        token.picture = userFromDb?.image
      }

      if (!token.sub) {
        throw new Error("Sessão inválida.")
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
