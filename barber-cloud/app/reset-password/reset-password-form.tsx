"use client"

import { cn } from "@/app/_lib/utils"
import { getPasswordValidationError } from "@/app/_lib/password-policy"
import { Button } from "@/app/_components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/app/_components/ui/field"
import { Input } from "@/app/_components/ui/input"
import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "@/app/_components/ui/theme-toggle"

type Mode = "input" | "success"

export default function ResetPasswordForm({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("input")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const searchParams = useSearchParams()
  const [token] = useState(() => searchParams.get("token"))

  useEffect(() => {
    if (token) {
      window.history.replaceState({}, "", "/reset-password")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
 
    
    if (!token) {
      setError("Este link de recuperação é inválido ou está incompleto")
      return
    }

    const passwordError = getPasswordValidationError(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível redefinir a senha")
      }

      setMode("success")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao redefinir a senha. Tente novamente.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirect = () => {
    setIsRedirecting(true)
    setTimeout(() => {
      window.location.href = "/login"
    }, 600)
  }

  return (
    <div className={cn("relative flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-foreground transition-colors", className)}>
      <div className="absolute right-6 top-6 flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
        <span className="text-xs font-medium text-muted-foreground">Tema</span>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-20 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <Image
              src="/logoPretoBrancoFundoOFF.png"
              alt="Régua Máxima"
              width={56}
              height={24}
              className="h-auto w-14 dark:invert"
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.h1
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-center text-3xl font-bold tracking-tight text-foreground"
            >
              {mode === "input" ? "Crie uma nova senha" : "Senha redefinida!"}
            </motion.h1>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {mode === "input" && (
            <motion.form
              key="reset-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <FieldGroup className="space-y-3">
                <Field className="space-y-2">
                  <FieldLabel htmlFor="new-password" className="text-sm font-bold text-foreground">Nova Senha</FieldLabel>
                  <div className="relative">
                    <Input id="new-password" type={showPassword ? "text" : "password"} placeholder="Sua nova senha" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-md border border-input bg-card px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use 8 ou mais caracteres e combine pelo menos 3 tipos: minúscula, maiúscula, número e símbolo.
                  </p>
                </Field>
                <Field className="space-y-2">
                  <FieldLabel htmlFor="confirm-password" className="text-sm font-bold text-foreground">Confirmar Senha</FieldLabel>
                  <div className="relative">
                    <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Repita a nova senha" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12 rounded-md border border-input bg-card px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0" />
                    <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showConfirmPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Field>
              </FieldGroup>
              <motion.div layout transition={{ duration: 0.25 }}>
                <Button type="submit" disabled={isSubmitting} className="mt-1 h-12 w-full cursor-pointer rounded-full bg-[#C3F32C] text-sm font-bold text-[#121212] transition-all hover:scale-[1.02] hover:bg-[#d4ff30] active:scale-[0.98] disabled:opacity-50">
                  {isSubmitting ? "Salvando..." : "Redefinir Senha"}
                </Button>
                {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
              </motion.div>
            </motion.form>
          )}

          {mode === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: -16 }} transition={{ duration: 0.35, ease: "easeOut" }} className="flex flex-col items-center gap-6 py-2 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}>
                <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
                  <circle cx="44" cy="44" r="32" stroke="currentColor" strokeWidth="3.5" className="text-border" />
                  <motion.circle cx="44" cy="44" r="32" stroke="#C3F32C" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="201" initial={{ strokeDashoffset: 201 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.75, delay: 0.3, ease: "easeOut" }} style={{ rotate: "-90deg", transformOrigin: "center" }} />
                  <motion.polyline points="28,45 39,56 60,33" stroke="#C3F32C" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="65" initial={{ strokeDashoffset: 65 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.38, delay: 1.0, ease: "easeOut" }} />
                </svg>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.3 }} className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">Pronto!</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">Sua senha foi atualizada com sucesso.<br />Você já pode acessar sua conta.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.3 }} className="w-full space-y-3">
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                  <motion.div className="h-full rounded-full bg-[#C3F32C]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, delay: 1.4, ease: "linear" }} onAnimationComplete={handleRedirect} />
                </div>
                <Button type="button" onClick={handleRedirect} className="h-12 w-full cursor-pointer rounded-full bg-[#C3F32C] text-sm font-bold text-[#121212] transition-all hover:scale-[1.02] hover:bg-[#d4ff30] active:scale-[0.98]">
                  Ir para o login agora
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isRedirecting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeInOut" }} className="fixed inset-0 z-50 bg-black" />
        )}
      </AnimatePresence>
    </div>
  )
}
