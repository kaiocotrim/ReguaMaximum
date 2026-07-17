// "use client"

// import { useState } from "react"
// import { Card } from "@/app/_components/ui/card"
// import { Button } from "@/app/_components/ui/button"
// import { acceptInvite, rejectInvite } from "@/app/_actions/inviteActions"
// import { Check, X } from "lucide-react"

// interface InviteCardProps {
//   invite: {
//     id: string
//     barbershop: {
//       name: string
//       // ajuste conforme os campos reais do seu model Barbershop
//     }
//     inviter: {
//       name: string | null
//     }
//   }
// }

// export default function InviteCard({ invite }: InviteCardProps) {
//   const [loading, setLoading] = useState<"accept" | "reject" | null>(null)

//   const handleAccept = async () => {
//     setLoading("accept")
//     try {
//       await acceptInvite(invite.id)
//     } finally {
//       setLoading(null)
//     }
//   }

//   const handleReject = async () => {
//     setLoading("reject")
//     try {
//       await rejectInvite(invite.id)
//     } finally {
//       setLoading(null)
//     }
//   }

//   return (
//     <Card className="flex items-center justify-between p-4">
//       <div>
//         <p className="font-medium text-white">{invite.barbershop.name}</p>
//         <p className="text-xs text-zinc-400">
//           Convidado por {invite.inviter.name ?? "desconhecido"}
//         </p>
//       </div>

//       <div className="flex gap-2">
//         <Button
//           size="icon"
//           onClick={handleAccept}
//           disabled={loading !== null}
//           className="bg-[#C3F32C] text-black hover:bg-[#b3e025]"
//         >
//           <Check className="h-4 w-4" />
//         </Button>
//         <Button
//           size="icon"
//           variant="secondary"
//           onClick={handleReject}
//           disabled={loading !== null}
//           className="bg-zinc-800 text-red-400 hover:bg-zinc-700"
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </div>
//     </Card>
//   )
// }
"use client"

import { useState } from "react"
import { Card } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import {
  Avatar,
  AvatarFallback,
} from "@/app/_components/ui/avatar"
import { acceptInvite, rejectInvite } from "@/app/_actions/inviteActions"
import { Check, X, Loader2 } from "lucide-react"

interface InviteCardProps {
  invite: {
    id: string
    barbershop: {
      name: string
    }
    inviter: {
      name: string | null
    }
  }
}

const getIniciais = (nome: string) =>
  nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export default function InviteCard({ invite }: InviteCardProps) {
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null)

  const handleAccept = async () => {
    setLoading("accept")
    try {
      await acceptInvite(invite.id)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    setLoading("reject")
    try {
      await rejectInvite(invite.id)
    } finally {
      setLoading(null)
    }
  }

  const isLoading = loading !== null

  return (
    <Card className="group relative flex items-center justify-between gap-4 border-zinc-800 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-11 w-11 border border-zinc-800 bg-zinc-900">
          <AvatarFallback className="bg-zinc-900 text-sm font-medium text-[#C3F32C]">
            {getIniciais(invite.barbershop.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-50">
            {invite.barbershop.name}
          </p>
          <p className="truncate text-xs text-zinc-500">
            Convite de {invite.inviter.name ?? "um administrador"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReject}
          disabled={isLoading}
          aria-label="Recusar convite"
          className="h-9 w-9 border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-red-900/50 hover:bg-red-950/30 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:opacity-40"
        >
          {loading === "reject" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>

        <Button
          size="icon"
          onClick={handleAccept}
          disabled={isLoading}
          aria-label="Aceitar convite"
          className="h-9 w-9 bg-[#C3F32C] text-black transition-colors hover:bg-[#d4ff4d] focus-visible:ring-2 focus-visible:ring-[#C3F32C]/50 disabled:opacity-40"
        >
          {loading === "accept" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  )
}