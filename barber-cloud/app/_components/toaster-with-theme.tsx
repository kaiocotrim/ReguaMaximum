"use client"

import { Toaster } from "sonner"
import { useTheme } from "next-themes"

export function ToasterWithTheme() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme === "light" ? "light" : "dark"}
      richColors
      position="bottom-right"
    />
  )
}