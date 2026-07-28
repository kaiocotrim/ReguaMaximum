

"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { assertAllowedImageUrl } from "@/app/_lib/image-url"
import { addDays } from "@/app/_lib/plan-license"
import { redirect } from "next/navigation"
import { PlanLicenseStatus } from "@/app/generated/prisma/client"

type CreateBarbershopInput = {
  nome: string
  telefone: string
  cidade: string
  endereco: string
  latitude?: number | null
  longitude?: number | null
  descricao: string
  tags: string[]
  logo_url: string
  capa_url: string | null
  instagram: string
  horario_abertura: string
  horario_fechamento: string
  cor_marca: string
}

// ─── Serviços padrão criados automaticamente para toda barbearia nova ──────

const SERVICOS_PADRAO = [
  {
    name: "Corte de Cabelo",
    description: "Estilo personalizado com as últimas tendências.",
    price: 60.0,
    duration: 40,
    imageUrl:
      "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
  },
  {
    name: "Barba",
    description: "Modelagem completa para destacar sua masculinidade.",
    price: 40.0,
    duration: 20,
    imageUrl:
      "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
  },
  {
    name: "Pézinho",
    description: "Acabamento perfeito para um visual renovado.",
    price: 35.0,
    duration: 15,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
  {
    name: "Sobrancelha",
    description: "Expressão acentuada com modelagem precisa.",
    price: 20.0,
    duration: 15,
    imageUrl:
      "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
  },
  {
    name: "Massagem",
    description: "Relaxe com uma massagem revigorante.",
    price: 50.0,
    duration: 30,
    imageUrl:
      "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
  },
  {
    name: "Hidratação",
    description: "Hidratação profunda para cabelo e barba.",
    price: 25.0,
    duration: 25,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
];


export async function createBarbershop(dados: CreateBarbershopInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "BARBER") {
    throw new Error("Apenas barbeiros podem criar uma barbearia.")
  }

  const name = dados.nome.trim()
  const phone = dados.telefone.trim()
  const city = dados.cidade.trim()
  const address = dados.endereco.trim()

  if (!name || name.length > 120) {
    throw new Error("Informe um nome válido para a barbearia.")
  }

  if (!phone || phone.length > 30) {
    throw new Error("Informe um telefone válido.")
  }

  if (!city || city.length > 100 || !address || address.length > 240) {
    throw new Error("Informe um endereço válido.")
  }

 const logoUrl = assertAllowedImageUrl(dados.logo_url, "Logo inválido.")
 const coverUrl = dados.capa_url
   ? assertAllowedImageUrl(dados.capa_url, "Imagem de capa inválida.")
   : null

  await db.$transaction(async (transaction) => {
    const [barber, existingBarbershop, claimedLicense] = await Promise.all([
      transaction.barber.findUnique({
        where: { userId: session.user.id },
        select: { id: true, barbershopId: true },
      }),
      transaction.barbershop.findFirst({
        where: { ownerId: session.user.id },
        select: { id: true },
      }),
      transaction.planLicense.findFirst({
        where: {
          claimedById: session.user.id,
          status: PlanLicenseStatus.CLAIMED,
          barbershopId: null,
        },
        orderBy: { claimedAt: "desc" },
        select: { id: true, durationDays: true },
      }),
    ])

    if (!barber) throw new Error("Perfil de barbeiro não encontrado.")
    if (barber.barbershopId) {
      throw new Error("Você já está vinculado a uma barbearia.")
    }
    if (existingBarbershop) {
      throw new Error("Você já possui uma barbearia cadastrada.")
    }
    if (!claimedLicense) {
      throw new Error("Valide uma chave de liberação antes de continuar.")
    }

    const barbershop = await transaction.barbershop.create({
      data: {
        name,
        phones: [phone],
        cidade: city,
        address,
        latitude: dados.latitude ?? null,
        longitude: dados.longitude ?? null,
        description: dados.descricao.trim().slice(0, 2000),
        tags: dados.tags.slice(0, 12),
        imageUrl: logoUrl,
        capaUrl: coverUrl,
        instagram: dados.instagram.trim().slice(0, 100) || null,
        horarioAbertura: dados.horario_abertura,
        horarioFechamento: dados.horario_fechamento,
        corMarca: dados.cor_marca,
        ownerId: session.user.id,
        barbers: {
          connect: {
            id: barber.id,
          },
        },
        services: {
          create: SERVICOS_PADRAO,
        },
      },
      select: { id: true },
    })

    const activatedAt = new Date()
    const activatedLicense = await transaction.planLicense.updateMany({
      where: {
        id: claimedLicense.id,
        claimedById: session.user.id,
        status: PlanLicenseStatus.CLAIMED,
        barbershopId: null,
      },
      data: {
        status: PlanLicenseStatus.ACTIVE,
        barbershopId: barbershop.id,
        activatedAt,
        expiresAt: addDays(activatedAt, claimedLicense.durationDays),
      },
    })

    if (activatedLicense.count !== 1) {
      throw new Error("A chave já foi utilizada. Solicite uma nova licença.")
    }
  })

  redirect("/dashboard")
}
