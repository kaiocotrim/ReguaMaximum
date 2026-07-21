// // "use client";

// // import Link from "next/link";
// // import { createService } from "@/app/_actions/service/create-service";

// // export function ServiceForm() {
// //   return (
// //     <form
// //       action={createService}
// //       className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
// //     >
// //       <div>
// //         <h1 className="text-3xl font-bold text-white">
// //           Novo Serviço
// //         </h1>

// //         <p className="mt-2 text-sm text-zinc-400">
// //           Cadastre um novo serviço para sua barbearia.
// //         </p>
// //       </div>

// //       {/* Nome */}
// //       <div>
// //         <label className="mb-2 block text-sm font-medium text-zinc-300">
// //           Nome do Serviço
// //         </label>

// //         <input
// //           name="name"
// //           type="text"
// //           placeholder="Ex: Corte Degradê"
// //           className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-[#C3F32C]"
// //           required
// //         />
// //       </div>

// //       {/* Descrição */}
// //       <div>
// //         <label className="mb-2 block text-sm font-medium text-zinc-300">
// //           Descrição
// //         </label>

// //         <textarea
// //           name="description"
// //           rows={4}
// //           placeholder="Descreva o serviço..."
// //           className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-[#C3F32C]"
// //           required
// //         />
// //       </div>

// //       {/* Preço */}
// //       <div>
// //         <label className="mb-2 block text-sm font-medium text-zinc-300">
// //           Preço
// //         </label>

// //         <input
// //           name="price"
// //           type="number"
// //           step="0.01"
// //           min="0"
// //           placeholder="0,00"
// //           className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-[#C3F32C]"
// //           required
// //         />
// //       </div>

// //       {/* Botões */}
// //       <div className="flex justify-end gap-4">
// //         <Link
// //           href="/dashboard/servicos"
// //           className="rounded-xl border border-zinc-700 px-6 py-3 text-white transition hover:bg-zinc-800"
// //         >
// //           Cancelar
// //         </Link>

// //         <button
// //           type="submit"
// //           className="rounded-xl bg-[#C3F32C] px-6 py-3 font-semibold text-black transition hover:opacity-90"
// //         >
// //           Salvar Serviço
// //         </button>
// //       </div>
// //     </form>
// //   );
// // }

// "use client"

// import Link from "next/link"
// import { motion } from "framer-motion"
// import { createService } from "@/app/_actions/service/create-service"

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.06,
//       delayChildren: 0.1,
//     },
//   },
// }

// const item = {
//   hidden: { opacity: 0, y: 12 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
// }

// const inputClasses =
//   "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-[#C3F32C]"

// export function ServiceForm() {
//   return (
//     <motion.form
//       action={createService}
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-8"
//     >
//       <motion.div variants={item}>
//         <h1 className="text-2xl font-semibold tracking-tight text-white">
//           Novo Serviço
//         </h1>

//         <p className="mt-1.5 text-sm text-zinc-500">
//           Cadastre um novo serviço para sua barbearia.
//         </p>
//       </motion.div>

//       {/* Nome */}
//       <motion.div variants={item}>
//         <label className="mb-2 block text-sm font-medium text-zinc-400">
//           Nome do Serviço
//         </label>

//         <input
//           name="name"
//           type="text"
//           placeholder="Ex: Corte Degradê"
//           className={inputClasses}
//           required
//         />
//       </motion.div>

//       {/* Descrição */}
//       <motion.div variants={item}>
//         <label className="mb-2 block text-sm font-medium text-zinc-400">
//           Descrição
//         </label>

//         <textarea
//           name="description"
//           rows={4}
//           placeholder="Descreva o serviço..."
//           className={`${inputClasses} resize-none`}
//           required
//         />
//       </motion.div>

//       {/* Preço */}
//       <motion.div variants={item}>
//         <label className="mb-2 block text-sm font-medium text-zinc-400">
//           Preço
//         </label>

//         <div className="relative">
//           <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
//             R$
//           </span>
//           <input
//             name="price"
//             type="number"
//             step="0.01"
//             min="0"
//             placeholder="0,00"
//             className={`${inputClasses} pl-11`}
//             required
//           />
//         </div>
//       </motion.div>

//       {/* Botões */}
//       <motion.div variants={item} className="flex justify-end gap-3 pt-2">
//         <Link
//           href="/dashboard/servicos"
//           className="rounded-xl border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
//         >
//           Cancelar
//         </Link>

//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           type="submit"
//           className="rounded-xl bg-[#C3F32C] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023]"
//         >
//           Salvar Serviço
//         </motion.button>
//       </motion.div>
//     </motion.form>
//   )
// }

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { createService } from "@/app/_actions/service/create-service"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

const inputClasses =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-[#C3F32C]"

export function ServiceForm() {
  return (
    <motion.form
      action={createService}
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-800/60 bg-zinc-950 p-8"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Novo Serviço
        </h1>

        <p className="mt-1.5 text-sm text-zinc-500">
          Cadastre um novo serviço para sua barbearia.
        </p>
      </motion.div>

      {/* Nome */}
      <motion.div variants={item}>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Nome do Serviço
        </label>

        <input
          name="name"
          type="text"
          placeholder="Ex: Corte Degradê"
          className={inputClasses}
          required
        />
      </motion.div>

      {/* Descrição */}
      <motion.div variants={item}>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Descrição
        </label>

        <textarea
          name="description"
          rows={4}
          placeholder="Descreva o serviço..."
          className={`${inputClasses} resize-none`}
          required
        />
      </motion.div>

      {/* Preço e Duração */}
      <motion.div variants={item} className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Preço
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              R$
            </span>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className={`${inputClasses} pl-11`}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Duração
          </label>

          <div className="relative">
            <input
              type="number"
              name="duration"
              min="0"
              placeholder="Tempo em minutos"
              className={`${inputClasses} pr-14`}
              required
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              min
            </span>
          </div>
        </div>
      </motion.div>

      {/* Botões */}
      <motion.div variants={item} className="flex justify-end gap-3 pt-2">
        <Link
          href="/dashboard/servicos"
          className="rounded-xl border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
        >
          Cancelar
        </Link>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="rounded-xl bg-[#C3F32C] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#b3e023]"
        >
          Salvar Serviço
        </motion.button>
      </motion.div>
    </motion.form>
  )
}