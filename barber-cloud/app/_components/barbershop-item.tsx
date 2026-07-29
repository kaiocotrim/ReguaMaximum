import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Star, ChevronRight, Eye, MapPin } from "lucide-react"
import { Badge } from "./ui/badge"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: {
    id: string
    name: string
    address: string
    imageUrl: string
    reviews: { rating: number }[]
  }
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  const reviewCount = barbershop.reviews.length
  const averageRating =
    reviewCount > 0
      ? barbershop.reviews.reduce(
          (total, review) => total + review.rating,
          0,
        ) / reviewCount
      : null

  return (
    <Card className="group h-full w-full min-w-[167px] overflow-hidden rounded-2xl border-border/70 p-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:border-[#C3F32C]/60 hover:bg-background hover:shadow-[0_16px_38px_-18px_rgba(135,180,0,0.65)] motion-reduce:transform-none motion-reduce:transition-none lg:min-w-0">
      <CardContent className="p-0 px-1 pt-0">
        <div className="relative h-[159px] w-full overflow-hidden rounded-2xl sm:h-[180px] lg:h-[190px]">
          <Image
            fill
            className="rounded-2xl object-cover p-1 transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
            src={barbershop.imageUrl}
            alt={`Barbershop: ${barbershop.name}`}
          />

          <Badge className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[#C3F32C] px-2 py-1 text-xs text-[#254F50] shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 motion-reduce:transform-none">
            <Star
              className="barbershop-card-star h-3 w-3"
              fill="#254F50"
            />
            {averageRating === null ? "Novo" : averageRating.toFixed(1)}
          </Badge>

          <Link
            href={`/barbershops/${barbershop.id}`}
            className="absolute inset-x-2 bottom-2 hidden translate-y-4 rounded-xl border border-white/15 bg-black/75 p-3 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none sm:block"
          >
            <p className="flex items-center gap-1.5 truncate text-xs leading-4 text-white/80">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
              <span className="truncate">{barbershop.address}</span>
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate text-[11px] text-white/60">
                {reviewCount === 0
                  ? "Barbearia nova"
                  : `${reviewCount} ${
                      reviewCount === 1 ? "avaliação" : "avaliações"
                    }`}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#C3F32C]">
                <Eye className="h-3.5 w-3.5" />
                Ver perfil
              </span>
            </div>
          </Link>
        </div>

        {/* Nome da barbearia */}
        <div className="px-1 py-3">
          <h3 className="truncate font-semibold text-foreground transition-colors duration-300 group-hover:text-[#71910d] dark:group-hover:text-[#C3F32C]">
            {barbershop.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{barbershop.address}</p>
          <Link href={`/barbershops/${barbershop.id}`}>
            <Button className="mt-3 w-full cursor-pointer font-bold text-foreground transition-colors duration-300 group-hover:bg-[#C3F32C] group-hover:text-[#254F50] hover:bg-[#C3F32C] hover:text-[#254F50] dark:text-[#254F50] dark:hover:text-[#254F50]">
              Agendar
              <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
