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

export default async function GetBarber() {
  

  return (
    <AlertDialog>
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
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            
            <div>
              <InviteBarber />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction className="font-medium text-black hover:bg-[#b3e025]">
            Convidar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
