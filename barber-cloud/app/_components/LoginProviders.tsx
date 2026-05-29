"use client"

import Image from "next/image"
import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import  { LoginForm }  from "@/app/_components/login-form"
 
const LOGIN_PROVIDERS = [
  { id: "google", src: "/google-icon.svg", label: "Google" },
  { id: "facebook", src: "/facebook-icon.svg", label: "Facebook" },
  { id: "apple", src: "/Apple-icon.svg", label: "Apple" },
  { id: "github", src: "/GitHub-icon.svg", label: "GitHub" },
]

export function LoginProviders() {
  const handleLogin = async (provider: string) => {
    await signIn(provider)
  }

  return (
    
    <div className="mt-3 flex flex-col gap-2">
        {LOGIN_PROVIDERS.map((provider) => (
        <Button
          key={provider.id}
          onClick={() => handleLogin(provider.id)}
          className="w-full justify-start gap-3 rounded-xl bg-[#C3F32C] text-black hover:bg-[#d6f083] cursor-pointer"
        >
          <Image
            src={provider.src}
            alt={provider.label}
            width={16}
            height={16}
          />
          Continuar com {provider.label}
        </Button>
      ))}
      
    </div>
  )
}