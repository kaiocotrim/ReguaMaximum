// app/_components/page-toast.tsx
"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, X } from "lucide-react"

type Toast = {
  id: string
  message: string
  variant: "error" | "success"
}

export function PageToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const raw = sessionStorage.getItem("toast")
    if (!raw) return

    sessionStorage.removeItem("toast")

    try {
      const parsed = JSON.parse(raw) as Omit<Toast, "id">
      const id = crypto.randomUUID()
      setToasts([{ id, ...parsed }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    } catch {
      // ignora JSON inválido
    }
  }, [])

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = toast.variant === "success" ? CheckCircle2 : AlertTriangle
          const styles =
            toast.variant === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`pointer-events-auto flex items-start gap-2 rounded-xl border p-3 text-sm shadow-lg backdrop-blur ${styles}`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
                aria-label="Fechar alerta"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}