"use client"

import { SmartphoneIcon } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  // ✅ Uma única arrow function, sem tipo extra
  const handlePhoneClick = () => {
    navigator.clipboard.writeText(phone)
    toast.success("Número copiado para a área de transferência!")
  }

  return (
    <Button variant="outline" size="sm" onClick={handlePhoneClick}>
      <SmartphoneIcon className="mr-2" />
      Copiar
    </Button>
  )
}

export default PhoneItem