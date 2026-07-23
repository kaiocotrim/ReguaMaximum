"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer relative inline-flex items-center h-6 w-11 rounded-full transition-colors shrink-0 bg-[#C3F32C]"
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-[#204749] transform transition-transform ${
          isDark ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}