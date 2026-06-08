"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/_components/ui/button"
import { Heart, LockIcon } from "lucide-react"

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

interface FavoriteButtonProps {
  barbershopId: string
  initialFavorited?: boolean
}

const FavoriteButton = ({
  barbershopId,
  initialFavorited = false,
}: FavoriteButtonProps) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [favorited, setFavorited] = useState(initialFavorited)
  const [animating, setAnimating] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleFavorite = async () => {
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
          className="w-full cursor-pointer bg-black/10"
          variant="secondary"
          onClick={handleFavorite}
        >
          <Heart
            className={`h-4 w-4 ${
              favorited
                ? "fill-[#C3F32C] text-[#C3F32C]"
                : "text-[#C3F32C]"
            }`}
            style={{
              animation: animating
                ? "heart-pop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)"
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

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="max-w-[360px] border border-[#2a2a28] bg-[#111110] p-0">

          <div className="h-[3px] w-full bg-[#C3F32C]" />

          <div className="p-8 pb-6">
            <AlertDialogHeader>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#C3F32C]/30 bg-[#C3F32C]/10">
                <LockIcon className="h-4 w-4 text-[#C3F32C]" />
              </div>

              <AlertDialogTitle className="text-[17px] text-[#f0efe8]">
                Faça login para favoritar
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm text-[#888780]">
                Você precisa estar logado para favoritar uma barbearia.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-8 flex gap-2.5">
              <AlertDialogCancel>
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-[#C3F32C] text-[#111110]"
                onClick={() => {
                  setShowAlert(false)
                  router.push("/login")
                }}
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