import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer"
import { db } from "../../_lib/prisma"
import { normalizeAllowedImageUrl } from "@/app/_lib/image-url"
import Image from "next/image"
import { Button } from "../../_components/ui/button"
import ShareButton from "@/app/_components/ShareButton"
import {
  ChevronLeft,
  MapIcon,
  StarIcon,
  Smartphone,
  CircleUser,
  ChevronRight,
  User,
  ExternalLink,
  CalendarX2,
} from "lucide-react"
import { FaInstagram } from "react-icons/fa"
import Link from "next/link"
import { Card } from "@/app/_components/ui/card"
import ServiceItem from "@/app/_components/service-item"
import PhoneItem from "@/app/_components/ui/phone-item"
import MenuBtn from "@/app/_components/ui/MenuBtn"
import FavoriteButton from "@/app/_components/favorite-button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BarbershopContentTabs } from "@/app/_components/BarbershopContentTabs"
import { BarbershopStoryCarousel } from "@/app/_components/BarbershopStoryCarousel"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

const getInstagramProfile = (instagram: string | null) => {
  if (!instagram) return null

  const handle = instagram
    .trim()
    .replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0]

  if (!/^[a-zA-Z0-9._]{1,30}$/.test(handle)) return null

  return {
    handle,
    url: `https://www.instagram.com/${handle}/`,
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const { id } = await params

  const barbershop = await db.barbershop.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      phones: true,
      instagram: true,
      description: true,
      imageUrl: true,
      capaUrl: true,
      acceptsBookings: true,
      services: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          price: true,
          duration: true,
        },
      },
      photos: {
        select: { id: true, imageUrl: true },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      barbers: {
        where: { isActive: true },
        select: {
          id: true,
          nome: true,
          avatar: true,
          serviceConfigs: {
            select: {
              serviceId: true,
              enabled: true,
              customPrice: true,
              customDuration: true,
            },
          },
          user: { select: { name: true, image: true } },
          reviews: {
            select: { rating: true },
          },
        },
      },
    },
  })

  if (!barbershop) return <p>Barbearia não encontrada.</p>

  const barbershopReviewCount = barbershop.reviews.length
  const barbershopAverage =
    barbershopReviewCount > 0
      ? barbershop.reviews.reduce(
          (total, review) => total + review.rating,
          0,
        ) / barbershopReviewCount
      : 0

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    barbershop.address,
  )}`
  const instagramProfile = getInstagramProfile(barbershop.instagram)

  const session = await getServerSession(authOptions)

  const isFavorited = session?.user?.id
    ? !!(await db.favoriteBarbershop.findUnique({
        where: {
          userId_barbershopId: {
          userId: session.user.id,
            barbershopId: id,
          },
        },
      }))
    : false

  return (
    <div className="min-h-screen bg-[#f5f7f3] pb-10 dark:bg-zinc-950 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl">
      <section className="lg:mx-8 lg:pt-6">
        <div className="overflow-visible bg-card lg:rounded-3xl lg:border lg:border-border/60 lg:shadow-[0_18px_50px_rgba(37,79,80,0.10)]">
      {/* Hero image */}
      {/* Hero image */}
      <div className="relative h-[260px] w-full sm:h-[340px] lg:h-[390px]">
        <Image
          alt={`Imagem da barbearia ${barbershop.name}`}
          fill
          sizes="100vw"
          className="rounded-b-3xl object-cover lg:rounded-t-3xl lg:rounded-b-none"
          src={barbershop.capaUrl || barbershop.imageUrl}
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-28 rounded-b-3xl bg-gradient-to-t from-black/70 to-transparent lg:rounded-none" />

        <Link href="/">
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 left-4 cursor-pointer bg-white backdrop-blur-sm hover:bg-[#EAECEC] dark:bg-black/70 lg:top-6 lg:left-6"
          >
            <ChevronLeft className="h-5 w-5 dark:text-[#C3F32C]"/>
          </Button>
        </Link>
        <MenuBtn className="absolute top-4 right-4 cursor-pointer bg-white text-[#254F50] backdrop-blur-sm hover:bg-[#EAECEC] hover:bg-white dark:bg-black/70 dark:text-[#C3F32C] dark:hover:bg-black/90 lg:top-6 lg:right-6" />

        {/* ─── Logo da barbearia ─── */}
        {/* TODO: trocar por barbershop.logoUrl quando o campo existir no schema */}

        {/* OPÇÃO 1 — Padrão (sem anel) */}
        {/* <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-full bg-zinc-800 ring-4 ring-[#171717]">
            <Image
              alt={`Logo da barbearia ${barbershop.name}`}
              fill
              sizes="80px"
              className="object-cover"
              src={barbershop.imageUrl}
            />
          </div> */}

        {/* OPÇÃO 2 — Clássico Instagram (gradiente colorido) */}
        <div className="absolute -bottom-10 left-6 lg:-bottom-12 lg:left-1/2 lg:-translate-x-1/2">
          <BarbershopStoryCarousel
            name={barbershop.name}
            logoUrl={barbershop.imageUrl}
            photos={barbershop.photos}
          />
        </div>

        {/* OPÇÃO 3 — Verde (melhores amigos) ✅ ATIVO */}
        {/* <div
          className="absolute -bottom-10 left-6 h-20 w-20 rounded-full"
          style={{ background: "#22c55e", padding: "4px" }}
        >
          <div
            style={{
              borderRadius: "50%",
              background: "#171717",
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              padding: "5px",
            }}
          >
            <Image
              alt={`Logo da barbearia ${barbershop.name}`}
              fill
              sizes="80px"
              className="rounded-full object-cover p-1"
              src={barbershop.imageUrl}
            />
          </div>
        </div> */}
      </div>

      {/* Header info */}
      <div className="flex items-start justify-between gap-6 px-6 pt-14 lg:flex-col lg:items-center lg:px-10 lg:pt-20 lg:pb-8 lg:text-center">
        <div className="min-w-0 lg:flex lg:flex-col lg:items-center">
          <h1 className="mb-2 truncate text-2xl font-bold text-[#C3F32C] lg:max-w-3xl lg:text-4xl">
            <span className="shine-text">{barbershop.name}</span>
          </h1>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir o endereço da ${barbershop.name} no Google Maps`}
            title="Abrir no Google Maps"
            className="group mb-1.5 flex max-w-full items-center gap-1.5 text-[#254F50] transition-colors hover:text-[#173b3c] dark:text-zinc-300 dark:hover:text-[#C3F32C] lg:justify-center"
          >
            <MapIcon className="h-4 w-4 shrink-0" />
            <span className="truncate text-sm underline-offset-4 group-hover:underline">
              {barbershop.address}
            </span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-45 transition-opacity group-hover:opacity-100" />
          </a>

          <div className="flex items-center gap-1.5 lg:justify-center">
            <StarIcon className="h-4 w-4 shrink-0 fill-[#254F50] text-[#254F50] " />
            <p className="text-sm text-[#254F50] dark:text-zinc-300">
              {barbershopReviewCount > 0 ? barbershopAverage.toFixed(1) : "Novo"} ·{" "}
              {barbershopReviewCount} avaliaç
              {barbershopReviewCount === 1 ? "ão" : "ões"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:justify-end lg:mt-2 lg:justify-center">
          <FavoriteButton 
            barbershopId={barbershop.id}
            initialFavorited={isFavorited}
          />

          {/* <Button
            className="cursor-pointer justify-start gap-2 bg-background dark:bg-black/10 text-xs"
            variant="secondary"
            size="sm"
          >
            <Share className="h-3.5 w-3.5 shrink-0 text-[#C3F32C] " />
            Compartilhar
          </Button> */}

          <ShareButton />


          {/* <Drawer  >
            <DrawerTrigger className="bg-black">
              <Button
                className="cursor-pointer justify-start gap-2 bg-black/10 text-xs"
                variant="secondary"
                size="sm"
              >
                <CircleUser className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
                {barbershop.barbers.length} barbeiro
                {barbershop.barbers.length !== 1 ? "s" : ""}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer> */}

          <Drawer>
            <DrawerTrigger className="">
              <Button
                className="cursor-pointer justify-start gap-2 bg-background dark:bg-black/10 text-xs"
                variant="secondary"
                size="sm"
              >
                <CircleUser className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
                {barbershop.barbers.length} barbeiro
                {barbershop.barbers.length !== 1 ? "s" : ""}
              </Button>
            </DrawerTrigger>

            <DrawerContent className="border-t dark:border-zinc-800 dark:bg-zinc-950">
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-black tracking-tight dakr:text-white">
                  Nossos barbeiros
                </DrawerTitle>
                <DrawerDescription className="text-xs tracking-widest dark:text-zinc-500 uppercase">
                  {/* This action cannot be undone. */}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                {/* <Button className="h-11 rounded-xl bg-[#C3F32C] font-bold text-black hover:bg-[#d4ff3d]">
                  Submit
                </Button> */}

                {barbershop.barbers.length === 0 ? (
                  <p className="py-4 text-center text-sm text-zinc-500">
                    Nenhum barbeiro cadastrado nesta barbearia.
                  </p>
                ) : (
                  barbershop.barbers.map((barber) => {
                    const name = barber.nome || barber.user.name || "Barbeiro"
                    const avatarUrl =
                      normalizeAllowedImageUrl(barber.avatar) ??
                      normalizeAllowedImageUrl(barber.user.image)
                    const reviewCount = barber.reviews.length
                    const averageRating =
                      reviewCount > 0
                        ? barber.reviews.reduce(
                            (total, review) => total + review.rating,
                            0,
                          ) / reviewCount
                        : 0

                    return (
                      <Link key={barber.id} href={`/barbers/${barber.id}`}>
                      <Card className="border-none bg-black/10 p-4 mb-2 transition-colors hover:bg-black/20">
                        <div className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            {avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt={name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                                <User className="h-5 w-5 text-zinc-400" />
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-semibold text-white">
                                {name}
                              </span>
                              <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                                <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-amber-400">
                                  {reviewCount > 0 ? averageRating.toFixed(1) : "Novo"}
                                </span>
                                <span>
                                  · {reviewCount} avaliaç
                                  {reviewCount === 1 ? "ão" : "ões"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <ChevronRight className="h-5 w-5 text-zinc-400" />
                          </div>
                        </div>
                      </Card>
                      </Link>
                    )
                  })
                )}

                <DrawerClose>
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl bg-[#C3F32C] hover:bg-[#254F50] hover:text-[#C3F32C] dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
        </div>
      </section>

      <div className="lg:mx-8 lg:mt-8 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-6">
      {/* Sobre nós */}
      <aside className="px-6 pt-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pt-0">
        <Card className="border-none bg-background p-4 dark:bg-zinc-900 lg:rounded-2xl lg:border lg:border-border/60 lg:p-6 lg:shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-wide text-[#254F50] dark:text-[#C3F32C] uppercase">
              Sobre nós
            </h2>
          </div>
          <p className="text-sm leading-relaxed dark:text-zinc-300 text-[#254F50]">
            {barbershop.description || "Nenhuma descrição informada."}
          </p>
        </Card>
      </aside>

      {/* Banner
      <div className="px-6 pt-6">
        <div className="relative h-32 w-full overflow-hidden rounded-2xl">
          <img
            src="/maoBannerSite.png"
            alt="Promoção"
            className="h-full w-full object-cover"
          />
        </div>
      </div> */}

      <BarbershopContentTabs
        average={barbershopAverage}
        reviews={barbershop.reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          clientName: review.user.name ?? "Cliente",
          createdAt: review.createdAt.toISOString(),
        }))}
        services={
          <div className="space-y-4">
            {!barbershop.acceptsBookings && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-100">
                <CalendarX2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">
                    Agendamentos temporariamente pausados
                  </p>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">
                    Esta barbearia não está recebendo novas marcações no
                    momento.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
            {barbershop.services.length > 0 ? (
              barbershop.services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={{
                    ...service,
                    price: Number(service.price),
                  }}
                  barbershopId={barbershop.id}
                  acceptsBookings={barbershop.acceptsBookings}
                  barbers={barbershop.barbers.map((barber) => ({
                    id: barber.id,
                    avatar:
                      normalizeAllowedImageUrl(barber.avatar) ??
                      normalizeAllowedImageUrl(barber.user.image),
                    user: {
                      name: barber.nome ?? barber.user.name,
                    },
                    serviceConfig: barber.serviceConfigs.find(
                      (config) => config.serviceId === service.id,
                    )
                      ? {
                          enabled:
                            barber.serviceConfigs.find(
                              (config) => config.serviceId === service.id,
                            )!.enabled,
                          customPrice:
                            barber.serviceConfigs.find(
                              (config) => config.serviceId === service.id,
                            )!.customPrice === null
                              ? null
                              : Number(
                                  barber.serviceConfigs.find(
                                    (config) =>
                                      config.serviceId === service.id,
                                  )!.customPrice,
                                ),
                          customDuration:
                            barber.serviceConfigs.find(
                              (config) => config.serviceId === service.id,
                            )!.customDuration,
                        }
                      : null,
                  }))}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground lg:col-span-2">
                Nenhum serviço cadastrado nesta barbearia.
              </div>
            )}
            </div>
          </div>
        }
      />

      {/* Contato */}
      <aside className="px-6 pt-8 lg:col-start-1 lg:row-start-2 lg:px-0 lg:pt-0">
        <Card className="border-none bg-background p-4 dark:bg-zinc-900 lg:rounded-2xl lg:border lg:border-border/60 lg:p-6 lg:shadow-sm">
        <h2 className="mb-3 text-xs font-bold tracking-wide text-[#254F50] uppercase dark:text-[#C3F32C]">
          Contato
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {barbershop.phones.length > 0 ? (
            barbershop.phones.map((phone) => (
              <div
                key={phone}
                className="flex items-center justify-between gap-2 rounded-xl border bg-background p-4 dark:border-white/10 dark:bg-black/10"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="h-4 w-4 text-[#C3F32C]" />
                  <p className="text-sm dark:text-zinc-200">{phone}</p>
                </div>
                <PhoneItem phone={phone} />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum telefone informado.
            </p>
          )}

          {instagramProfile ? (
            <a
              href={instagramProfile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir o Instagram da ${barbershop.name}`}
              className="group flex items-center justify-between gap-3 rounded-xl border bg-background p-4 transition-colors hover:border-[#C3F32C]/70 hover:bg-[#C3F32C]/10 dark:border-white/10 dark:bg-black/10 dark:hover:border-[#C3F32C]/50 dark:hover:bg-[#C3F32C]/5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FaInstagram className="h-4 w-4 shrink-0 text-[#8b5cf6] dark:text-[#C3F32C]" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Instagram</p>
                  <p className="truncate text-sm font-medium text-[#254F50] dark:text-zinc-200">
                    @{instagramProfile.handle}
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[#254F50] dark:group-hover:text-[#C3F32C]" />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum Instagram informado.
            </p>
          )}
        </div>
        </Card>
      </aside>
      </div>
      </div>
    </div>
  )
}

export default BarbershopPage
