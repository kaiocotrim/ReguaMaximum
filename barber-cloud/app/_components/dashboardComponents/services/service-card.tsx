"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Pencil, Trash2 } from "lucide-react"

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: string | number
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950 transition-colors hover:border-zinc-700"
    >
      <div className="relative h-32 w-full bg-zinc-900">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {service.name}
          </h2>

          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="rounded-full bg-[#C3F32C] px-2.5 py-0.5 text-xs font-semibold text-black">
            R$ {Number(service.price).toFixed(2)}
          </span>

          <div className="flex gap-1.5">
            <button className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
              <Pencil size={14} strokeWidth={2} />
            </button>

            <button className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-red-500 transition-colors hover:bg-red-500/10 hover:border-red-500/30">
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}