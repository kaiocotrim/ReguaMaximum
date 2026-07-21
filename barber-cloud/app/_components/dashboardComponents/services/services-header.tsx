// import Link from "next/link";
// import { Plus } from "lucide-react";

// interface ServicesHeaderProps {
//   total: number;
// }

// export function ServicesHeader({ total }: ServicesHeaderProps) {
//   return (
//     <div className="mb-8 flex items-center justify-between">
//       <div>
//         <h1 className="text-3xl font-bold text-white">
//           Serviços
//         </h1>

//         <p className="mt-2 text-zinc-400">
//           Gerencie os serviços oferecidos pela sua barbearia.
//         </p>

//         <span className="mt-3 inline-block rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
//           {total} serviço{total !== 1 && "s"}
//         </span>
//       </div>

//       <Link
//         href="/dashboard/servicos/novo"
//         className="flex items-center gap-2 rounded-xl bg-[#C3F32C] px-5 py-3 font-semibold text-black transition hover:opacity-90"
//       >
//         <Plus size={18} />
//         Novo Serviço
//       </Link>
//     </div>
//   );
// }

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface ServicesHeaderProps {
  total: number
}

export function ServicesHeader({ total }: ServicesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Serviços
        </h1>

        <p className="mt-1.5 text-sm text-zinc-500 sm:text-base">
          Gerencie os serviços oferecidos pela sua barbearia.
        </p>

        <span className="mt-3 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
          {total} serviço{total !== 1 && "s"}
        </span>
      </div>

      <motion.div whileTap={{ scale: 0.97 }} className="sm:shrink-0">
        <Link
          href="/dashboard/servicos/novo"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C3F32C] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023]"
        >
          <Plus size={18} strokeWidth={2.5} />
          Novo Serviço
        </Link>
      </motion.div>
    </motion.div>
  )
}