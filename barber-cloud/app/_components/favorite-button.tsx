// "use client"

// import { useState } from "react"
// import { Button } from "@/app/_components/ui/button"
// import { Heart } from "lucide-react"

// interface FavoriteButtonProps {
//   barbershopId: string
//   initialFavorited?: boolean
// }

// const FavoriteButton = ({ barbershopId, initialFavorited = false }: FavoriteButtonProps) => {
//   const [favorited, setFavorited] = useState(initialFavorited) // ← aqui
//   const [animating, setAnimating] = useState(false)

//   const handleFavorite = async () => {
//     setAnimating(true)
//     setTimeout(() => setAnimating(false), 600)

//     try {
//       const response = await fetch("/api/favorites", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ barbershopId }),
//       })

//       const data = await response.json()
//       setFavorited(data.favorited)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   return (
//     <div className="relative inline-flex w-full">
//       <Button
//         className="w-full bg-black/10"
//         variant="secondary"
//         onClick={handleFavorite}
//       >
//         <Heart
//           className={`h-4 w-4 ${
//             favorited ? "fill-[#C3F32C] text-[#C3F32C]" : "text-[#C3F32C]"
//           }`}
//           style={{
//             animation: animating ? "heart-pop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards" : "none",
//           }}
//         />
//         Favoritar
//       </Button>

//       <style>{`
//         @keyframes heart-pop {
//           0%   { transform: scale(1); }
//           15%  { transform: scale(0.85); }
//           45%  { transform: scale(1.4); }
//           65%  { transform: scale(0.95); }
//           80%  { transform: scale(1.1); }
//           100% { transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default FavoriteButton

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/app/_components/ui/button"
import { Heart , LockIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"

import { signIn } from "next-auth/react"

interface FavoriteButtonProps {
  barbershopId: string
  initialFavorited?: boolean
}

const FavoriteButton = ({
  barbershopId,
  initialFavorited = false,
}: FavoriteButtonProps) => {
  const { data: session } = useSession()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [animating, setAnimating] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleFavorite = async () => {
    // Usuário não logado → abre o alert
    if (!session?.user) {
      setShowAlert(true)
      return
    }

    setAnimating(true)
    setTimeout(() => setAnimating(false), 600)

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barbershopId }),
      })

      const data = await response.json()
      setFavorited(data.favorited)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="relative inline-flex w-full">
        <Button
          className="w-full bg-black/10 cursor-pointer"
          variant="secondary"
          onClick={handleFavorite}
        >
          <Heart
            className={`h-4 w-4 ${
              favorited ? "fill-[#C3F32C] text-[#C3F32C]" : "text-[#C3F32C]"
            }`}
            style={{
              animation: animating
                ? "heart-pop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards"
                : "none",
            }}
          />
          Favoritar
        </Button>

        <style>{`
          @keyframes heart-pop {
            0%   { transform: scale(1); }
            15%  { transform: scale(0.85); }
            45%  { transform: scale(1.4); }
            65%  { transform: scale(0.95); }
            80%  { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>

      {/* Alert para usuário não logado */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="max-w-[360px] overflow-hidden border border-[#2a2a28] bg-[#111110] p-0">
          {/* barra de acento no topo */}
          <div className="h-[3px] w-full bg-[#C3F32C]" />

          <div className="p-8 pb-6">
            <AlertDialogHeader>
              {/* ícone de cadeado */}
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#C3F32C]/30 bg-[#C3F32C]/10">
                <LockIcon className="h-4 w-4 text-[#C3F32C]" />
              </div>

              <AlertDialogTitle className="text-[17px] font-medium tracking-tight text-[#f0efe8]">
                Faça login para favoritar
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-relaxed text-[#888780]">
                Você precisa estar logado para favoritar uma barbearia.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-8 flex gap-2.5 sm:flex-row">
              <AlertDialogCancel className="cursor-pointer flex-1 border border-[#2a2a28] bg-transparent text-[#888780] hover:border-[#444441] hover:bg-transparent hover:text-[#f0efe8]">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="flex-1 bg-[#C3F32C] font-medium text-[#111110] transition-all hover:bg-[#C3F32C]/88 active:scale-[0.97] cursor-pointer"
                onClick={() => signIn()}
              >
                Fazer login
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default FavoriteButton
