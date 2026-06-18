import Header from "../_components/header"
import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import { Heart } from "lucide-react"
import Image from "next/image"

const FavoritesPage = async () => {
  const favorites = await db.favoriteBarbershop.findMany({
    include: {
      barbershop: true,
    },
  })

  return (
    <div>
      <Header />

      <div className="m-5">
        <div className="border-border/40 bg-card rounded-xl border px-7 py-6">
          {/* Badge */}

          {/* Texto + imagem */}
          <div className="flex min-h-[150px] items-center justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-[#C3F32C] uppercase">
                <Heart className="h-3 w-3 fill-[#C3F32C] text-[#C3F32C]" />
                <span className="text-[#C3F32C]">favoritos</span>
              </div>
              <h1 className="mb-1 text-[18px] leading-snug font-medium">
                Barbearias que você curte
              </h1>
              <p className="text-muted-foreground text-[13px]">
                Seus estabelecimentos salvos em um só lugar.
              </p>
            </div>

            <div className="flex w-[150px] shrink-0 items-center justify-center">
              <Image
                src="/favoritoOK1.png"
                alt="Favoritos"
                width={150}
                height={150}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Rodapé */}
          <div className="border-border/30 mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-[13px]">
              <strong className="text-foreground font-medium">
                {favorites.length}
              </strong>{" "}
              {favorites.length === 1 ? "barbearia salva" : "barbearias salvas"}
            </span>
          </div>
        </div>
      </div>

      {/* {favorites.length === 0 ? (
        <p className="text-muted-foreground px-5 text-sm">
          Você ainda não salvou nenhuma barbearia.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 p-5">
          {favorites.map((favorite) => (
            <BarbershopItem
              key={favorite.barbershop.id}
              barbershop={favorite.barbershop}
            />
          ))}
        </div>
      )} */}

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <Image
            src="/favoritoNot.png"
            alt="Nenhuma barbearia favorita"
            width={220}
            height={220}
            className="mb-4"
          />

          <h2 className="mb-2 text-lg font-medium">Nenhuma favorita ainda</h2>

          <p className="text-muted-foreground max-w-xs text-sm">
            Explore as barbearias e toque no coração para salvar suas favoritas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 p-5">
          {favorites.map((favorite) => (
            <BarbershopItem
              key={favorite.barbershop.id}
              barbershop={favorite.barbershop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
