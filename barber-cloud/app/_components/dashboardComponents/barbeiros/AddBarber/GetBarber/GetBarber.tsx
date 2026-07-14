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

import { db } from "@/app/_lib/prisma"

import { Button } from "@/app/_components/ui/button"

export default async function GetBarber() {

    const produto = await db.barber.findMany()  

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          size="icon"
          variant="secondary"
          className={"text-white5 cursor-pointer"}
        >
          +
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            
            teste

          </AlertDialogTitle>
          <AlertDialogDescription>
            <ul>
            {produto.map((p) => (
                <li key={p.id}>{p.nome}</li>
            ) )}

            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
