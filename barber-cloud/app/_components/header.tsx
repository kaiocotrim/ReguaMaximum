import Image from "next/image"
import MenuBtn from "./ui/MenuBtn"
import Link from "next/link"

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/">
          <Image
            src="/LogoMComBorder3.png"
            alt="BarberCloud Logo"
            width={60}
            height={50}
            className="h-auto w-14 lg:w-16"
          />
        </Link>

        <MenuBtn />
      </div>
    </header>
  )
}

export default Header
