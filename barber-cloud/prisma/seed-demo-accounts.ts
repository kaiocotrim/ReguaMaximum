import "dotenv/config"

import bcrypt from "bcrypt"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../app/generated/prisma/client"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL não está definida.")

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

const DEMO_PASSWORD = "ReguaDemo@2026"

const unsplashPhoto = (
  id: string,
  width: number,
  height: number,
  position = "center",
) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=${width}&h=${height}&q=88&crop=${position}`

const shops = [
  {
    name: "Barbearia Horizonte",
    owner: "Rafael Horizonte",
    address: "Rua das Palmeiras, 120",
    latitude: -23.5505,
    longitude: -46.6333,
    logoUrl: unsplashPhoto("1503951914875-452162b0f3f1", 800, 800),
    coverUrl: unsplashPhoto("1585747860715-2ba37e788b70", 1800, 760),
    avatarUrl: unsplashPhoto("1500648767791-00dcc994a43e", 800, 800, "faces"),
  },
  {
    name: "Studio Navalha",
    owner: "Bruno Navalha",
    address: "Avenida Central, 845",
    latitude: -23.5614,
    longitude: -46.6559,
    logoUrl: unsplashPhoto("1524230616393-d6229fcd2eff", 800, 800),
    coverUrl: unsplashPhoto("1746201175551-20a92849835b", 1800, 760),
    avatarUrl: unsplashPhoto("1507003211169-0a1dd7228f2d", 800, 800, "faces"),
  },
  {
    name: "Corte Nobre",
    owner: "Lucas Nobre",
    address: "Rua Bela Vista, 332",
    latitude: -23.5489,
    longitude: -46.6388,
    logoUrl: unsplashPhoto("1462850932907-687c915e3d38", 800, 800),
    coverUrl: unsplashPhoto("1671750145942-da9fed292290", 1800, 760),
    avatarUrl: unsplashPhoto("1506794778202-cad84cf45f1d", 800, 800, "faces"),
  },
  {
    name: "Barbearia Imperial",
    owner: "Diego Imperial",
    address: "Alameda Santos, 1510",
    latitude: -23.5652,
    longitude: -46.6528,
    logoUrl: unsplashPhoto("1622287162716-f311baa1a2b8", 800, 800),
    coverUrl: unsplashPhoto("1702865272115-5afdbae975af", 1800, 760),
    avatarUrl: unsplashPhoto("1531384441138-2736e62e0919", 800, 800, "faces"),
  },
  {
    name: "Estação do Corte",
    owner: "Felipe Estação",
    address: "Rua da Consolação, 980",
    latitude: -23.5558,
    longitude: -46.6611,
    logoUrl: unsplashPhoto("1621605815971-fbc98d665033", 800, 800),
    coverUrl: unsplashPhoto("1671750145646-0f4d791b8025", 1800, 760),
    avatarUrl: unsplashPhoto("1492562080023-ab3db95bfbce", 800, 800, "faces"),
  },
  {
    name: "Navalha Urbana",
    owner: "Caio Urbano",
    address: "Rua Augusta, 725",
    latitude: -23.5544,
    longitude: -46.6582,
    logoUrl: unsplashPhoto("1758043085008-d3cff6d86453", 800, 800),
    coverUrl: unsplashPhoto("1759134248487-e8baaf31e33e", 1800, 760),
    avatarUrl: unsplashPhoto("1560250097-0b93528c311a", 800, 800, "faces"),
  },
  {
    name: "Barba & Classe",
    owner: "André Classe",
    address: "Avenida Paulista, 900",
    latitude: -23.5651,
    longitude: -46.6518,
    logoUrl: unsplashPhoto("1599351431202-1e0f0137899a", 800, 800),
    coverUrl: unsplashPhoto("1768678218016-6bed23a35116", 1800, 760),
    avatarUrl: unsplashPhoto("1568602471122-7832951cc4c5", 800, 800, "faces"),
  },
  {
    name: "Mestre da Régua",
    owner: "Marcos Régua",
    address: "Rua Vergueiro, 640",
    latitude: -23.5754,
    longitude: -46.6408,
    logoUrl: unsplashPhoto("1580618672591-eb180b1a973f", 800, 800),
    coverUrl: unsplashPhoto("1675599193884-38c7a5ceecbc", 1800, 760),
    avatarUrl: unsplashPhoto("1570295999919-56ceb5ecca61", 800, 800, "faces"),
  },
  {
    name: "Cavalheiros Barber",
    owner: "Gustavo Cavalheiro",
    address: "Rua Oscar Freire, 430",
    latitude: -23.5618,
    longitude: -46.6692,
    logoUrl: unsplashPhoto("1507679799987-c73779587ccf", 800, 800),
    coverUrl: unsplashPhoto("1781455793310-8427c96454c7", 1800, 760),
    avatarUrl: unsplashPhoto("1504257432389-52343af06ae3", 800, 800, "faces"),
  },
  {
    name: "Ponto do Barbeiro",
    owner: "Renato Ponto",
    address: "Avenida Ipiranga, 710",
    latitude: -23.5429,
    longitude: -46.6427,
    logoUrl: unsplashPhoto("1626379499242-52863d313084", 800, 800),
    coverUrl: unsplashPhoto("1521146764736-56c929d59c83", 1800, 760),
    avatarUrl: unsplashPhoto("1617137968427-85924c800a22", 800, 800, "faces"),
  },
] as const

const services = [
  {
    name: "Corte de Cabelo",
    description: "Corte masculino personalizado, clássico ou moderno.",
    price: 55,
    duration: 40,
    imageUrl: unsplashPhoto("1747830280502-f33d7305a714", 1200, 800),
  },
  {
    name: "Barba",
    description: "Modelagem de barba com toalha quente e acabamento.",
    price: 38,
    duration: 30,
    imageUrl: unsplashPhoto("1706716109264-ac80916f55ea", 1200, 800),
  },
  {
    name: "Cabelo + Barba",
    description: "Combo completo de corte e barba.",
    price: 85,
    duration: 70,
    imageUrl: unsplashPhoto("1578853283498-cc994096481b", 1200, 800),
  },
  {
    name: "Acabamento",
    description: "Pezinho, contornos e acabamento de precisão.",
    price: 25,
    duration: 20,
    imageUrl: unsplashPhoto("1762965164662-30126ffccaf1", 1200, 800),
  },
  {
    name: "Sobrancelha",
    description: "Limpeza e alinhamento masculino de sobrancelhas.",
    price: 20,
    duration: 15,
    imageUrl: unsplashPhoto("1549663369-22ac6b052faf", 1200, 800),
  },
  {
    name: "Luzes",
    description: "Luzes masculinas com tonalização e finalização.",
    price: 120,
    duration: 120,
    imageUrl: unsplashPhoto("1711639838283-e3e878d1b7c1", 1200, 800),
  },
]

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)

  for (let index = 0; index < shops.length; index++) {
    const {
      name: shopName,
      owner: ownerName,
      address,
      latitude,
      longitude,
      logoUrl,
      coverUrl,
      avatarUrl,
    } = shops[index]
    const number = String(index + 1).padStart(2, "0")
    const email = `demo.barber${number}@reguamaxima.test`

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        update: {
          name: ownerName,
          password: passwordHash,
          role: "BARBER",
          telefone: `(11) 98888-${String(1000 + index)}`,
          image: avatarUrl,
        },
        create: {
          name: ownerName,
          email,
          password: passwordHash,
          role: "BARBER",
          telefone: `(11) 98888-${String(1000 + index)}`,
          image: avatarUrl,
        },
      })

      const barber = await tx.barber.upsert({
        where: { userId: user.id },
        update: {
          nome: ownerName,
          cidade: "São Paulo",
          especialidades: ["Cabelo", "Barba", "Acabamento"],
          isActive: true,
          jobTitle: "Proprietário e barbeiro",
          avatar: avatarUrl,
        },
        create: {
          userId: user.id,
          nome: ownerName,
          avatar: avatarUrl,
          cidade: "São Paulo",
          bio: `Profissional responsável pela ${shopName}.`,
          especialidades: ["Cabelo", "Barba", "Acabamento"],
          isActive: true,
          jobTitle: "Proprietário e barbeiro",
        },
      })

      const existingShop = await tx.barbershop.findFirst({
        where: { ownerId: user.id },
        select: { id: true },
      })

      const shop = existingShop
        ? await tx.barbershop.update({
            where: { id: existingShop.id },
            data: {
              name: shopName,
              address,
              cidade: "São Paulo",
              latitude,
              longitude,
              imageUrl: logoUrl,
              capaUrl: coverUrl,
              acceptsBookings: true,
              horarioAbertura: "09:00",
              horarioFechamento: "19:00",
            },
          })
        : await tx.barbershop.create({
            data: {
              name: shopName,
              address,
              phones: [`(11) 97777-${String(2000 + index)}`],
              description:
                "Barbearia demonstrativa com atendimento personalizado, ambiente confortável e profissionais qualificados.",
              imageUrl: logoUrl,
              capaUrl: coverUrl,
              acceptsBookings: true,
              cidade: "São Paulo",
              tags: ["Cabelo", "Barba", "Acabamento"],
              instagram: `regua_demo_${number}`,
              horarioAbertura: "09:00",
              horarioFechamento: "19:00",
              corMarca: "#C3F32C",
              latitude,
              longitude,
              ownerId: user.id,
            },
          })

      await tx.barber.update({
        where: { id: barber.id },
        data: { barbershopId: shop.id },
      })

      for (const service of services) {
        const existingService = await tx.barbeshopService.findFirst({
          where: { barbershopId: shop.id, name: service.name },
          select: { id: true },
        })

        if (existingService) {
          await tx.barbeshopService.update({
            where: { id: existingService.id },
            data: service,
          })
        } else {
          await tx.barbeshopService.create({
            data: { ...service, barbershopId: shop.id },
          })
        }
      }

      for (let weekday = 0; weekday < 7; weekday++) {
        await tx.barberWorkSchedule.upsert({
          where: {
            barberId_weekday: { barberId: barber.id, weekday },
          },
          update: {
            enabled: weekday !== 0,
            startTime: "09:00",
            endTime: "19:00",
          },
          create: {
            barberId: barber.id,
            weekday,
            enabled: weekday !== 0,
            startTime: "09:00",
            endTime: "19:00",
          },
        })
      }
    })
  }

  console.log(`Contas demonstrativas criadas: ${shops.length}`)
}

main()
  .catch((error) => {
    console.error("Falha ao criar contas demonstrativas:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
