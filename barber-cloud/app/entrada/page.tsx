// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { db } from "@/app/_lib/prisma"
// import { Inbox } from "lucide-react"

// import Header from "../_components/header"
// import InviteCard from "@/app/_components/ui/InviteCard"

// const InboxPage = async () => {
//   const session = await getServerSession(authOptions)

//   if (!session?.user?.id) {
//     return <p>Você precisa estar logado.</p>
//   }

//   const convites = await db.barbershopInvite.findMany({
//     where: { inviteeId: session.user.id },
//     include: {
//       barbershop: true,
//       inviter: true,
//     },
//     orderBy: { expiresAt: "asc" },
//   })

//   return (
//     <div className="min-h-screen bg-[#0a0a0b]">
//       <Header />

//       <div className="mx-auto max-w-xl px-5 py-10">
//         <div className="mb-8 flex flex-col gap-1">
//           <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
//             Convites
//           </h1>
//           <p className="text-sm text-zinc-500">
//             {convites.length > 0
//               ? `Você tem ${convites.length} convite${convites.length > 1 ? "s" : ""} aguardando resposta`
//               : "Nenhum convite por aqui"}
//           </p>
//         </div>

//         {convites.length > 0 ? (
//           <div className="flex flex-col gap-3">
//             {convites.map((convite) => (
//               <InviteCard key={convite.id} invite={convite} />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-16">
//             <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900">
//               <Inbox className="h-5 w-5 text-zinc-600" />
//             </div>
//             <p className="text-sm text-zinc-500">
//               Quando uma barbearia te convidar, o convite aparece aqui.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default InboxPage

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { Inbox } from "lucide-react"

import Header from "../_components/header"
import InviteCard from "@/app/_components/ui/InviteCard"

const InboxPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <p>Você precisa estar logado.</p>
  }

  const convites = await db.barbershopInvite.findMany({
    where: { inviteeId: session.user.id },
    include: {
      barbershop: true,
      inviter: true,
    },
    orderBy: { expiresAt: "asc" },
  })

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="mx-auto max-w-xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-foreground text-xl font-semibold tracking-tight">
            Con<span className="text-primary">vites</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {convites.length > 0
              ? `Você tem ${convites.length} convite${convites.length > 1 ? "s" : ""} aguardando resposta`
              : "Nenhum convite por aqui"}
          </p>
        </div>

        {convites.length > 0 ? (
          <div className="flex flex-col gap-3">
            {convites.map((convite) => (
              <InviteCard key={convite.id} invite={convite} />
            ))}
          </div>
        ) : (
          <div className="border-border flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16">
            <div className="bg-muted flex h-11 w-11 items-center justify-center rounded-full">
              <Inbox className="text-primary h-5 w-5" />
            </div>
            <p className="text-muted-foreground text-sm">
              Quando uma barbearia te convidar, o convite aparece aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InboxPage