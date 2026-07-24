// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route" // ajuste o caminho conforme seu projeto
// import { db } from "@/app/_lib/prisma"

// import { Card } from "@/app/_components/ui/card"
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/app/_components/ui/avatar"
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/app/_components/ui/table"

// import GetBarber from "@/app/_components/dashboardComponents/barbeiros/AddBarber/GetBarber/GetBarber"

// const getIniciais = (nome: string) =>
//   nome
//     .split(" ")
//     .map((parte) => parte[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase()

// const AddBarber = async () => {
//   const session = await getServerSession(authOptions)

//   if (!session?.user?.id) {
//     return <p>Você precisa estar logado.</p>
//   }

//   // 1. Acha a barbearia do dono logado
//   const barbershop = await db.barbershop.findFirst({
//     where: { ownerId: session.user.id },
//   })

//   if (!barbershop) {
//     return <p>Nenhuma barbearia encontrada para este usuário.</p>
//   }

//   // 2. Define o intervalo do mês atual
//   const now = new Date()
//   const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
//   const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 1)

//   // 3. Busca os barbeiros dessa barbearia, já com os bookings do mês
//   const barbeiros = await db.barber.findMany({
//     where: { barbershopId: barbershop.id },
//     include: {
//       bookings: {
//         where: {
//           barbershopId: barbershop.id,
//           date: { gte: inicioMes, lt: fimMes },
//         },
//         include: { service: true },
//       },
//     },
//   })

//   const totalMensal = barbeiros.reduce((accTotal, barbeiro) => {
//     const valorBarbeiro = barbeiro.bookings.reduce(
//       (acc, booking) => acc + Number(booking.service.price),
//       0,
//     )
//     return accTotal + valorBarbeiro
//   }, 0)

//   return (
//     <Card className="mt-5 flex flex-col gap-2 rounded-2xl p-6 shadow-sm">
//       <div className="flex gap-2">
//         <h1 className="text-lg font-semibold">Lista de barbeiros</h1>
//         <GetBarber barbershopId={barbershop.id}></GetBarber>
//       </div>

//       <Table>
//         <TableCaption>Desempenho dos barbeiros neste mês.</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[220px]">Barbeiro</TableHead>
//             <TableHead>Cortes no mês</TableHead>
//             <TableHead className="text-right">Valor mensal</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {barbeiros.map((barbeiro) => {
//             const cortesNoMes = barbeiro.bookings.length
//             const valorMensal = barbeiro.bookings.reduce(
//               (acc, booking) => acc + Number(booking.service.price),
//               0,
//             )

//             return (
//               <TableRow key={barbeiro.id}>
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-3">
//                     <Avatar>
//                       <AvatarImage
//                         src={barbeiro.avatar ?? undefined}
//                         alt={barbeiro.nome ?? ""}
//                       />
//                       <AvatarFallback>
//                         {getIniciais(barbeiro.nome ?? "?")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span>{barbeiro.nome}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>{cortesNoMes}</TableCell>
//                 <TableCell className="text-right">
//                   {valorMensal.toLocaleString("pt-BR", {
//                     style: "currency",
//                     currency: "BRL",
//                   })}
//                 </TableCell>
//               </TableRow>
//             )
//           })}
//         </TableBody>
//         <TableFooter>
//           <TableRow>
//             <TableCell colSpan={2}>Total</TableCell>
//             <TableCell className="text-right text-[#C3F32C]">
//               {totalMensal.toLocaleString("pt-BR", {
//                 style: "currency",
//                 currency: "BRL",
//               })}
//             </TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </Card>
//   )
// }

// export default AddBarber


import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/app/_lib/prisma"

import { Card } from "@/app/_components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table"
import { Badge } from "@/app/_components/ui/badge"

import GetBarber from "@/app/_components/dashboardComponents/barbeiros/AddBarber/GetBarber/GetBarber"

const getIniciais = (nome: string) =>
  nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const AddBarber = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <p>Você precisa estar logado.</p>
  }

  const barbershop = await db.barbershop.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!barbershop) {
    return <p>Nenhuma barbearia encontrada para este usuário.</p>
  }

  const now = new Date()
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
  const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const barbeirosRaw = await db.barber.findMany({
    where: { barbershopId: barbershop.id },
    include: {
      bookings: {
        where: {
          barbershopId: barbershop.id,
          date: { gte: inicioMes, lt: fimMes },
        },
        include: { service: true },
      },
    },
  })

  // Calcula e já ordena por faturamento (maior primeiro)
  const barbeiros = barbeirosRaw
    .map((barbeiro) => {
      const cortesNoMes = barbeiro.bookings.length
      const valorMensal = barbeiro.bookings.reduce(
        (acc, booking) => acc + Number(booking.service.price),
        0,
      )
      return { ...barbeiro, cortesNoMes, valorMensal }
    })
    .sort((a, b) => b.valorMensal - a.valorMensal)

  const totalMensal = barbeiros.reduce((acc, b) => acc + b.valorMensal, 0)
  const melhorId = barbeiros[0]?.id

  return (
    <Card className="mt-5 flex flex-col gap-4 rounded-2xl p-6 shadow-sm ">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Lista de barbeiros</h2>
          <p className="text-sm text-muted-foreground">
            {barbeiros.length}{" "}
            {barbeiros.length === 1 ? "barbeiro cadastrado" : "barbeiros cadastrados"}
          </p>
        </div>
        <GetBarber barbershopId={barbershop.id} />
      </div>

      {barbeiros.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum barbeiro cadastrado ainda.
          </p>
          <p className="text-xs text-muted-foreground">
            Clique no botão acima para convidar o primeiro.
          </p>
        </div>
      ) : (
        <Table>
          <TableCaption>Desempenho dos barbeiros neste mês.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Barbeiro</TableHead>
              <TableHead>Cortes no mês</TableHead>
              <TableHead className="text-right">Valor mensal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbeiros.map((barbeiro) => (
              <TableRow key={barbeiro.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={barbeiro.avatar ?? undefined}
                        alt={barbeiro.nome ?? ""}
                      />
                      <AvatarFallback>
                        {getIniciais(barbeiro.nome ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{barbeiro.nome}</span>
                    {barbeiro.id === melhorId && barbeiro.valorMensal > 0 && (
                      <Badge className="bg-[#C3F32C]/10 text-[#C3F32C] hover:bg-[#C3F32C]/10">
                        Destaque
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{barbeiro.cortesNoMes}</TableCell>
                <TableCell className="text-right">
                  {formatarMoeda(barbeiro.valorMensal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right text-[#C3F32C]">
                {formatarMoeda(totalMensal)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  )
}

export default AddBarber