"use client"

import { Button } from "./button"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./sheet"
import { SheetDescription, SheetHeader, SheetTitle } from "./sheet"
import { CalendarCheck2 } from "lucide-react"
import { Contact } from "lucide-react"
import { ScissorsLineDashed } from "lucide-react"
import { Heart } from "lucide-react"
import { Clock } from "lucide-react"
import { User } from "lucide-react"
import { Settings } from "lucide-react"
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
      <SheetContent className="bg-black/40 backdrop-blur-sm text-white">
        <SheetHeader>
          <img src="/BannerReguaMX.png" alt="Logo" />
          <SheetTitle>Vai deixar o cabelo na régua?</SheetTitle>
          <SheetDescription>Regua Maximum.</SheetDescription>
          <div className="gap-2 flex flex-col mt-4">
            <h1>Menu</h1>
            <Button variant="outline" className="w-full">
              Agendar
              <CalendarCheck2 className="ml-2" /> 
            </Button>
            <Button variant="outline" className="w-full">
              Serviços 
              <ScissorsLineDashed className="ml-2" />
            </Button>
            <Button variant="outline" className="w-full">
              Favoritos 
              <Heart className="ml-2" />
            </Button>
            <Button variant="outline" className="w-full">
              Histórico 
              <Clock className="ml-2" />
            </Button>
            <Button variant="outline" className="w-full">
              Configurações 
              <Settings className="ml-2" />
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default MenuBtn
