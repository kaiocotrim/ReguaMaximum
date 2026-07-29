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
          className="w-full cursor-pointer bg-background dark:bg-black/10"
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
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[390px] gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card p-0 text-card-foreground shadow-2xl ring-0 dark:border-white/10">
          <div className="h-1 w-full bg-[#C3F32C]" />

          <div className="p-6 sm:p-7">
            <AlertDialogHeader className="place-items-start gap-0 text-left">
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-[#9abd20]/25 bg-[#C3F32C]/15 dark:border-[#C3F32C]/25 dark:bg-[#C3F32C]/10">
                <LockIcon className="size-5 text-[#739000] dark:text-[#C3F32C]" />
              </div>

              <AlertDialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                Faça login para favoritar
              </AlertDialogTitle>

              <AlertDialogDescription className="mt-2 max-w-[32ch] text-left text-sm leading-5 text-muted-foreground">
                Entre na sua conta para salvar esta barbearia nos seus
                favoritos.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 !-mx-0 !-mb-0 !flex-row !justify-end gap-2 border-0 bg-transparent p-0">
              <AlertDialogCancel className="h-10 cursor-pointer rounded-xl border-border bg-background px-4 text-foreground hover:bg-muted">
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                className="h-10 cursor-pointer rounded-xl bg-[#C3F32C] px-5 font-semibold text-[#172000] shadow-sm shadow-[#C3F32C]/20 hover:bg-[#b4e21f]"
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
