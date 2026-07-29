"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/_components/ui/carousel"

interface StoryPhoto {
  id: string
  imageUrl: string
}

export function BarbershopStoryCarousel({
  name,
  logoUrl,
  photos,
}: {
  name: string
  logoUrl: string
  photos: StoryPhoto[]
}) {
  const logo = (
    <div
      className={`relative h-20 w-20 rounded-full p-1 ${
        photos.length > 0
          ? "cursor-pointer bg-[#C3F32C] shadow-[0_0_18px_rgba(195,243,44,0.5)] transition-transform hover:scale-105"
          : "bg-border"
      }`}
      title={photos.length > 0 ? "Ver fotos da barbearia" : undefined}
    >
      {photos.length > 0 && (
        <span className="barbershop-story-pulse pointer-events-none absolute -inset-1 rounded-full border-2 border-[#C3F32C]" />
      )}
      <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-[5px] border-[#171717] bg-[#171717]">
        <Image
          alt={`Logo da barbearia ${name}`}
          fill
          sizes="80px"
          className="rounded-full object-cover"
          src={logoUrl}
        />
      </div>
    </div>
  )

  if (photos.length === 0) return logo

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" aria-label={`Ver fotos da ${name}`}>
          {logo}
        </button>
      </DialogTrigger>
      <DialogContent className="w-[94vw] max-w-3xl overflow-hidden rounded-2xl border-border bg-black p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Fotos da {name}</DialogTitle>
          <DialogDescription>
            Carrossel com as fotos publicadas pela barbearia.
          </DialogDescription>
        </DialogHeader>
        <Carousel opts={{ loop: photos.length > 1 }} className="w-full">
          <CarouselContent className="ml-0">
            {photos.map((photo, index) => (
              <CarouselItem key={photo.id} className="pl-0">
                <div className="relative h-[70vh] min-h-[360px] w-full bg-black">
                  <Image
                    src={photo.imageUrl}
                    alt={`Foto ${index + 1} da ${name}`}
                    fill
                    sizes="(max-width: 768px) 94vw, 768px"
                    className="object-contain"
                    priority={index === 0}
                  />
                  <div className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    {index + 1} / {photos.length}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {photos.length > 1 && (
            <>
              <CarouselPrevious className="left-3 border-white/20 bg-black/50 text-white hover:bg-black/70 hover:text-white" />
              <CarouselNext className="right-3 border-white/20 bg-black/50 text-white hover:bg-black/70 hover:text-white" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
