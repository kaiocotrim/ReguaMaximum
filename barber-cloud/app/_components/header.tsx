import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { SheetContent, SheetTrigger } from "./ui/sheet"
import MenuBtn from "./ui/MenuBtn"
import Link from "next/link"
{
  /*
  Este componente é responsável por exibir o cabeçalho da aplicação, incluindo o logotipo da BarberCloud e um botão de menu. Ele utiliza o componente `Card` para criar um layout estilizado e o Next.js Image para exibir o logotipo. O botão de menu é posicionado à direita do cabeçalho e pode ser usado para abrir um menu lateral ou realizar outras ações relacionadas à navegação.
*/
}
const Header = () => {
  return (
    <Card className="rounded-none bg-black opacity-100">
      <CardContent className="flex flex-row items-center justify-between">
        <Link href="/">
          <Image
            src="/LogoMComBorder3.png"
            alt="BarberCloud Logo"
            width={60}
            height={50}
          />
        </Link>

        {/* <Sheet>
          
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 shrink-0"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-slate-900">
            <p>Oi</p>
          </SheetContent>
        </Sheet> */}
        <MenuBtn />
      </CardContent>
    </Card>
  )
}

export default Header
