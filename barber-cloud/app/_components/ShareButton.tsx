"use client"

import { Share } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner" // troque por outra lib de toast se não usar sonner

const ShareButton = () => {
  const handleShare = async () => {
    const url = window.location.href

    try {
      // Se o navegador suportar a Web Share API (mobile principalmente)
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url,
        })
        return
      }

      // Fallback: copiar para a área de transferência
      await navigator.clipboard.writeText(url)
      toast.success("Link copiado!")
    } catch (error) {
      // Usuário cancelou o share nativo ou deu erro no clipboard
      console.error("Erro ao compartilhar:", error)
    }
  }

  return (
    <Button
      onClick={handleShare}
      className="cursor-pointer justify-start gap-2 bg-background dark:bg-black/10 text-xs"
      variant="secondary"
      size="sm"
    >
      <Share className="h-3.5 w-3.5 shrink-0 text-[#C3F32C]" />
      Compartilhar
    </Button>
  )
}

export default ShareButton