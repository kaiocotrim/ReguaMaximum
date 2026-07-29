"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleTheme = () => {
    const root = document.documentElement

    root.classList.add("theme-transition")
    setTheme(isDark ? "light" : "dark")

    window.setTimeout(() => {
      root.classList.remove("theme-transition")
    }, 450)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Ativar tema ${isDark ? "claro" : "escuro"}`}
      aria-pressed={isDark}
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
