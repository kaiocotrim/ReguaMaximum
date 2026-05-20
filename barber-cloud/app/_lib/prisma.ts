// import { PrismaPg } from "@prisma/adapter-pg"


// import { PrismaClient } from "../generated/prisma/client"

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// const databaseUrl = process.env.DATABASE_URL

// if (!databaseUrl) {
// 	throw new Error("DATABASE_URL nao esta definida")
// }

// export const db =
// 	globalForPrisma.prisma ||
// 	new PrismaClient({
// 		adapter: new PrismaPg(databaseUrl),
// 	})

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

// import { PrismaClient } from "../generated/prisma/client"

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// export const db =
//   globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db


import { PrismaClient } from "../generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL! 
})

export const db =
  globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db