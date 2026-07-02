// "use server"

// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { db } from "@/app/_lib/prisma"
// import { redirect } from "next/navigation"

// type CreateBarbershopInput = {
//   nome: string
//   telefone: string
//   cidade: string
//   endereco: string
//   descricao: string
//   tags: string[]
//   logo_url: string
//   capa_url: string | null
//   instagram: string
//   horario_abertura: string
//   horario_fechamento: string
//   cor_marca: string
// }

// // Serviços padrão criados automaticamente para toda barbearia nova
// const SERVICOS_PADRAO = [
//   {
//     name: "Corte de Cabelo",
//     description: "Estilo personalizado com as últimas tendências.",
//     price: 60.0,
//     imageUrl:
//       "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
//   },
//   {
//     name: "Barba",
//     description: "Modelagem completa para destacar sua masculinidade.",
//     price: 40.0,
//     imageUrl:
//       "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
//   },
//   {
//     name: "Pézinho",
//     description: "Acabamento perfeito para um visual renovado.",
//     price: 35.0,
//     imageUrl:
//       "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
//   },
//   {
//     name: "Sobrancelha",
//     description: "Expressão acentuada com modelagem precisa.",
//     price: 20.0,
//     imageUrl:
//       "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
//   },
//   {
//     name: "Massagem",
//     description: "Relaxe com uma massagem revigorante.",
//     price: 50.0,
//     imageUrl:
//       "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
//   },
//   {
//     name: "Hidratação",
//     description: "Hidratação profunda para cabelo e barba.",
//     price: 25.0,
//     imageUrl:
//       "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
//   },
// ]

// export async function createBarbershop(dados: CreateBarbershopInput) {
//   const session = await getServerSession(authOptions)

//   if (!session?.user?.id || session.user.role !== "BARBER") {
//     throw new Error("Apenas barbeiros podem criar uma barbearia.")
//   }

//   const barber = await db.barber.findUnique({
//     where: { userId: session.user.id },
//   })

//   if (!barber) throw new Error("Perfil de barbeiro não encontrado.")

//   const barbershop = await db.barbershop.create({
//     data: {
//       name:              dados.nome,
//       phones:            [dados.telefone],
//       cidade:            dados.cidade,
//       address:           dados.endereco,
//       description:       dados.descricao || "",
//       tags:              dados.tags,
//       imageUrl:          dados.logo_url,
//       capaUrl:           dados.capa_url,
//       instagram:         dados.instagram || null,
//       horarioAbertura:   dados.horario_abertura,
//       horarioFechamento: dados.horario_fechamento,
//       corMarca:          dados.cor_marca,
//       ownerId:           barber.id,
//       barbers: {
//         connect: { id: barber.id },
//       },
//       // cria a barbearia e os 6 serviços padrão numa única operação atômica
//       services: {
//         create: SERVICOS_PADRAO,
//       },
//     },
//   })

//   redirect("/barbeiro/dashboard")
// }

// "use server"

// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { db } from "@/app/_lib/prisma"
// import { redirect } from "next/navigation"

// type CreateBarbershopInput = {
//   nome: string
//   telefone: string
//   cidade: string
//   endereco: string
//   descricao: string
//   tags: string[]
//   logo_url: string
//   capa_url: string | null
//   instagram: string
//   horario_abertura: string
//   horario_fechamento: string
//   cor_marca: string
// }

// // ─── Geocoding / validação de endereço ─────────────────────────────────────

// const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
// const USER_AGENT = "SeuAppBarbearias/1.0 (contato@seudominio.com)" // troque pelo seu contato

// async function geocodarEndereco(endereco: string, cidade: string) {
//   const query = `${endereco}, ${cidade}`
//   const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`

//   const res = await fetch(url, {
//     headers: { "User-Agent": USER_AGENT },
//   })

//   if (!res.ok) {
//     throw new Error("Não foi possível validar o endereço. Tente novamente em instantes.")
//   }

//   const data = (await res.json()) as { lat: string; lon: string }[]

//   if (data.length === 0) {
//     throw new Error(
//       "Não conseguimos localizar esse endereço. Confira e tente novamente."
//     )
//   }

//   return {
//     latitude: parseFloat(data[0].lat),
//     longitude: parseFloat(data[0].lon),
//   }
// }

// // ─── Serviços padrão criados automaticamente para toda barbearia nova ──────

// const SERVICOS_PADRAO = [
//   {
//     name: "Corte de Cabelo",
//     description: "Estilo personalizado com as últimas tendências.",
//     price: 60.0,
//     imageUrl:
//       "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
//   },
//   {
//     name: "Barba",
//     description: "Modelagem completa para destacar sua masculinidade.",
//     price: 40.0,
//     imageUrl:
//       "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
//   },
//   {
//     name: "Pézinho",
//     description: "Acabamento perfeito para um visual renovado.",
//     price: 35.0,
//     imageUrl:
//       "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
//   },
//   {
//     name: "Sobrancelha",
//     description: "Expressão acentuada com modelagem precisa.",
//     price: 20.0,
//     imageUrl:
//       "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
//   },
//   {
//     name: "Massagem",
//     description: "Relaxe com uma massagem revigorante.",
//     price: 50.0,
//     imageUrl:
//       "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
//   },
//   {
//     name: "Hidratação",
//     description: "Hidratação profunda para cabelo e barba.",
//     price: 25.0,
//     imageUrl:
//       "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
//   },
// ]

// export async function createBarbershop(dados: CreateBarbershopInput) {
//   const session = await getServerSession(authOptions)

//   if (!session?.user?.id || session.user.role !== "BARBER") {
//     throw new Error("Apenas barbeiros podem criar uma barbearia.")
//   }

//   const barber = await db.barber.findUnique({
//     where: { userId: session.user.id },
//   })

//   if (!barber) throw new Error("Perfil de barbeiro não encontrado.")

//   // valida e geocodifica o endereço ANTES de criar qualquer coisa no banco.
//   // se o endereço não existir, isso lança e nada é salvo.
//   const { latitude, longitude } = await geocodarEndereco(dados.endereco, dados.cidade)

//   const barbershop = await db.barbershop.create({
//     data: {
//       name:              dados.nome,
//       phones:            [dados.telefone],
//       cidade:            dados.cidade,
//       address:           dados.endereco,
//       latitude:          ,
//       longitude:
//       description:       dados.descricao || "",
//       tags:              dados.tags,
//       imageUrl:          dados.logo_url,
//       capaUrl:           dados.capa_url,
//       instagram:         dados.instagram || null,
//       horarioAbertura:   dados.horario_abertura,
//       horarioFechamento: dados.horario_fechamento,
//       corMarca:          dados.cor_marca,
//       ownerId:           barber.id,
//       barbers: {
//         connect: { id: barber.id },
//       },
//       // cria a barbearia e os 6 serviços padrão numa única operação atômica
//       services: {
//         create: SERVICOS_PADRAO,
//       },
//     },
//   })

//   redirect("/barbeiro/dashboard")
// }


"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"
import { redirect } from "next/navigation"

type CreateBarbershopInput = {
  nome: string
  telefone: string
  cidade: string
  endereco: string
  latitude: number
  longitude: number
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
    imageUrl:
      "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
  },
  {
    name: "Barba",
    description: "Modelagem completa para destacar sua masculinidade.",
    price: 40.0,
    imageUrl:
      "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
  },
  {
    name: "Pézinho",
    description: "Acabamento perfeito para um visual renovado.",
    price: 35.0,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
  {
    name: "Sobrancelha",
    description: "Expressão acentuada com modelagem precisa.",
    price: 20.0,
    imageUrl:
      "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
  },
  {
    name: "Massagem",
    description: "Relaxe com uma massagem revigorante.",
    price: 50.0,
    imageUrl:
      "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
  },
  {
    name: "Hidratação",
    description: "Hidratação profunda para cabelo e barba.",
    price: 25.0,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
]

export async function createBarbershop(dados: CreateBarbershopInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "BARBER") {
    throw new Error("Apenas barbeiros podem criar uma barbearia.")
  }

  const barber = await db.barber.findUnique({
    where: { userId: session.user.id },
  })

  if (!barber) throw new Error("Perfil de barbeiro não encontrado.")

 const barbershop = await db.barbershop.create({
  data: {
    name: dados.nome,
    phones: [dados.telefone],
    cidade: dados.cidade,
    address: dados.endereco,
    latitude: dados.latitude,
    longitude: dados.longitude,
    description: dados.descricao || "",
    tags: dados.tags,
    imageUrl: dados.logo_url,
    capaUrl: dados.capa_url,
    instagram: dados.instagram || null,
    horarioAbertura: dados.horario_abertura,
    horarioFechamento: dados.horario_fechamento,
    corMarca: dados.cor_marca,

    // ALTERE ESTA LINHA
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
});

  redirect("/dashboard")
}