  // import {
  //   AlertDialog,
  //   AlertDialogAction,
  //   AlertDialogCancel,
  //   AlertDialogContent,
  //   AlertDialogDescription,
  //   AlertDialogFooter,
  //   AlertDialogHeader,
  //   AlertDialogTitle,
  //   AlertDialogTrigger,
  // } from "@/app/_components/ui/alert-dialog"

  // import InviteBarber from "../InviteBarber"



  // import { Button } from "@/app/_components/ui/button"
  // import { Plus } from "lucide-react"

  // export default async function GetBarber() {
    

  //   return (
  //     <AlertDialog>
  //       <AlertDialogTrigger asChild>
  //         <Button
  //           size="icon"
  //           variant="secondary"
  //           className="cursor-pointer bg-zinc-800 text-[#C3F32C] hover:bg-zinc-700"
  //         >
  //           <Plus className="h-4 w-4" />
  //         </Button>
  //       </AlertDialogTrigger>

  //       <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 border border-zinc-800 bg-[#0d0d0d]">
  //         <AlertDialogHeader>
  //           <AlertDialogTitle className="text-lg font-semibold text-gray-100">
  //           </AlertDialogTitle>

  //           <AlertDialogDescription asChild>
              
  //             <div>
  //               <InviteBarber />
  //             </div>
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>

  //         <AlertDialogFooter>
  //           <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
  //             Cancelar
  //           </AlertDialogCancel>
  //           <AlertDialogAction className="font-medium text-black hover:bg-[#b3e025]">
  //             Convidar
  //           </AlertDialogAction>
  //         </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>
  //   )
  // }


// "use client"
// import { inviteBarber } from "@/app/_actions/inviteBarber"
// import { useState } from "react"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/app/_components/ui/alert-dialog"

// import InviteBarber from "../InviteBarber"
// import { Button } from "@/app/_components/ui/button"
// import { Plus } from "lucide-react"

// interface ResultadoBusca {
//   id: string
//   userId: string
//   nome: string
//   user: {
//     email: string
//   }
// }

// export default function GetBarber() {
//   const [barberSelecionado, setBarberSelecionado] =
//     useState<ResultadoBusca | null>(null)
//   const [open, setOpen] = useState(false)

// const handleConvidar = async () => {
//   if (!barberSelecionado) return

//   try {
//     await inviteBarber(barberSelecionado.userId)
//     setBarberSelecionado(null)
//     setOpen(false)
//   } catch (error) {
//     console.error("Erro ao convidar barbeiro:", error)
//     // opcional: mostrar toast/erro na tela
//   }
// }
//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogTrigger asChild>
//         <Button
//           size="icon"
//           variant="secondary"
//           className="cursor-pointer bg-zinc-800 text-[#C3F32C] hover:bg-zinc-700"
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </AlertDialogTrigger>

//       <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 border border-zinc-800 bg-[#0d0d0d]">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="text-lg font-semibold text-gray-100">
//             Convidar barbeiro
//           </AlertDialogTitle>

//           <AlertDialogDescription asChild>
//             <div>
//               <InviteBarber onSelect={setBarberSelecionado} />
//             </div>
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <AlertDialogFooter>
//           <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
//             Cancelar
//           </AlertDialogCancel>
//           <AlertDialogAction
//             disabled={!barberSelecionado}
//             onClick={handleConvidar}
//             className="font-medium text-black hover:bg-[#b3e025] disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             Convidar
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog"

import InviteBarber from "../InviteBarber"
import { Button } from "@/app/_components/ui/button"
import { Plus } from "lucide-react"
import { inviteBarber } from "@/app/_actions/inviteBarber"

interface ResultadoBusca {
  id: string
  userId: string
  nome: string
  user: {
    email: string
  }
}

interface GetBarberProps {
  barbershopId: string
}

export default function GetBarber({ barbershopId }: GetBarberProps) {
  const [barberSelecionado, setBarberSelecionado] =
    useState<ResultadoBusca | null>(null)
  const [open, setOpen] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleConvidar = async () => {
    if (!barberSelecionado || !barbershopId) return

    setEnviando(true)
    setErro(null)

    try {
      await inviteBarber(barberSelecionado.userId, barbershopId)
      setBarberSelecionado(null)
      setOpen(false)
    } catch (err) {
      console.error(err)
      setErro("Não foi possível enviar o convite. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="cursor-pointer bg-zinc-800 text-[#C3F32C] hover:bg-zinc-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 border border-zinc-800 bg-[#0d0d0d]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-100">
            Convidar barbeiro
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div>
              <InviteBarber onSelect={setBarberSelecionado} />
              {erro && (
                <p className="mt-2 text-xs text-red-400">{erro}</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!barberSelecionado || enviando}
            onClick={handleConvidar}
            className="font-medium text-black hover:bg-[#b3e025] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Convidar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}