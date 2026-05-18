"use client"

import { Button } from "./button"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"

interface MenuBtnProps {
  className?: string
}

const MenuBtn = ({ className }: MenuBtnProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={className ?? "h-10 w-10 shrink-0"}
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900">
        <p>Oi</p>
      </SheetContent>
    </Sheet>
  )
}

export default MenuBtn