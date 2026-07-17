"use client"

import { MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface WhatsAppButtonProps {
  telefone: string | null
  nomeCliente: string | null
}

export function WhatsAppButton({ telefone, nomeCliente }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    if (!telefone) {
      toast.error("Cliente não possui telefone cadastrado.")
      return
    }

    // Assumindo que o telefone seja brasileiro se não tiver DDI
    const numeroNumerico = telefone.replace(/\D/g, "")
    const numeroFinal = numeroNumerico.startsWith("55") ? numeroNumerico : `55${numeroNumerico}`
    const saudacao = encodeURIComponent(`Olá, ${nomeCliente || "cliente"}! Estamos entrando em contato sobre o seu agendamento na barbearia.`)
    const url = `https://wa.me/${numeroFinal}?text=${saudacao}`

    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      type="button"
      className="text-green-400 cursor-pointer hover:text-white hover:bg-green-500 border border-green-500/30 hover:border-green-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      title="Avisar via WhatsApp"
    >
      <MessageCircle size={16} />
      <span>WhatsApp</span>
    </button>
  )
}
