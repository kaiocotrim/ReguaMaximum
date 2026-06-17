//O que esse arquivo faz?
//Ele fala pro TypeScript:
//"Ei, o user da sessão também tem um campo role do tipo UserRole"
//Sem isso o TypeScript fica perdido e pode causar erros mesmo o valor existindo em runtime.


import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User {
    role?: UserRole
  }
  interface Session {
    user: {
      role?: UserRole
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
  }
}