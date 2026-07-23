import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { SheetContent, SheetTrigger } from "./ui/sheet"
import MenuBtn from "./ui/MenuBtn"
import Link from "next/link"

const Header = () => {
  return (
    <Card className="rounded-none bg-background border-border opacity-100">
      <CardContent className="flex flex-row items-center justify-between cursor-pointer">
        <Link href="/">
          <Image
            src="/LogoMComBorder3.png"
            alt="BarberCloud Logo"
            width={60}
            height={50}
          />
        </Link>

        <MenuBtn />
      </CardContent>
    </Card>
  )
}

export default Header