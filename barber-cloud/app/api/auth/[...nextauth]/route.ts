// import { db } from "@/app/_lib/prisma"
// import NextAuth from "next-auth"  // ← sem espaço
// import GoogleProvider from "next-auth/providers/google"  // ← sem chaves
// import { PrismaAdapter } from "@auth/prisma-adapter"

// const handler = NextAuth({
//   adapter: PrismaAdpter(db) as Adapter,
//   providers: [
//     GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID as string,
//         clientSecret : process.env.GOOGLE_CLIENT_SECRET as string,
//     })
//   ]
// })

// export { handler as GET, handler as POST }

import { db } from "@/app/_lib/prisma"
import NextAuth from "next-auth"  // ← sem espaço
import GoogleProvider from "next-auth/providers/google"  // ← sem chaves
import { PrismaAdapter } from "@auth/prisma-adapter"

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }

