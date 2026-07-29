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

const shops = [
  ["Barbearia Horizonte", "Rafael Horizonte", "Rua das Palmeiras, 120", -23.5505, -46.6333],
  ["Studio Navalha", "Bruno Navalha", "Avenida Central, 845", -23.5614, -46.6559],
  ["Corte Nobre", "Lucas Nobre", "Rua Bela Vista, 332", -23.5489, -46.6388],
  ["Barbearia Imperial", "Diego Imperial", "Alameda Santos, 1510", -23.5652, -46.6528],
  ["Estação do Corte", "Felipe Estação", "Rua da Consolação, 980", -23.5558, -46.6611],
  ["Navalha Urbana", "Caio Urbano", "Rua Augusta, 725", -23.5544, -46.6582],
  ["Barba & Classe", "André Classe", "Avenida Paulista, 900", -23.5651, -46.6518],
  ["Mestre da Régua", "Marcos Régua", "Rua Vergueiro, 640", -23.5754, -46.6408],
  ["Cavalheiros Barber", "Gustavo Cavalheiro", "Rua Oscar Freire, 430", -23.5618, -46.6692],
  ["Ponto do Barbeiro", "Renato Ponto", "Avenida Ipiranga, 710", -23.5429, -46.6427],
] as const

const services = [
  {
    name: "Corte de Cabelo",
    description: "Corte masculino personalizado, clássico ou moderno.",
    price: 55,
    duration: 40,
    imageUrl: "/maquina.png",
  },
  {
    name: "Barba",
    description: "Modelagem de barba com toalha quente e acabamento.",
    price: 38,
    duration: 30,
    imageUrl: "/barbarIcon.png",
  },
  {
    name: "Cabelo + Barba",
    description: "Combo completo de corte e barba.",
    price: 85,
    duration: 70,
    imageUrl: "/maquina.png",
  },
  {
    name: "Acabamento",
    description: "Pezinho, contornos e acabamento de precisão.",
    price: 25,
    duration: 20,
    imageUrl: "/acabamentoIcon.png",
  },
  {
    name: "Sobrancelha",
    description: "Limpeza e alinhamento masculino de sobrancelhas.",
    price: 20,
    duration: 15,
    imageUrl: "/acabamentoIcon.png",
  },
  {
    name: "Luzes",
    description: "Luzes masculinas com tonalização e finalização.",
    price: 120,
    duration: 120,
    imageUrl: "/cabeloIcon.png",
  },
]

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)

  for (let index = 0; index < shops.length; index++) {
    const [shopName, ownerName, address, latitude, longitude] = shops[index]
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
        },
        create: {
          name: ownerName,
          email,
          password: passwordHash,
          role: "BARBER",
          telefone: `(11) 98888-${String(1000 + index)}`,
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
        },
        create: {
          userId: user.id,
          nome: ownerName,
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
              imageUrl: "/LogoMComBorder3.png",
              capaUrl: "/bannerReguaM-dark1.png",
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
