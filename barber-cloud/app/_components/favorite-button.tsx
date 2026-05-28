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
import { Heart } from "lucide-react"
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

const FavoriteButton = ({ barbershopId, initialFavorited = false }: FavoriteButtonProps) => {
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
          className="w-full bg-black/10"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Faça login para favoritar</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisa estar logado para favoritar uma barbearia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90"
              onClick={() => signIn()}
            >
              Fazer login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default FavoriteButton