"use client"

import { useActionState } from "react"
import { LoaderCircle, Save } from "lucide-react"

import {
  updateBarbershopDetails,
  type BarbershopDetailsFormState,
} from "@/app/_actions/barbershopSettings"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { Textarea } from "@/app/_components/ui/textarea"

type BarbershopDetailsFormProps = {
  barbershop: {
    name: string
    address: string
    phones: string[]
    description: string
    cidade: string | null
    instagram: string | null
    horarioAbertura: string | null
    horarioFechamento: string | null
  }
}

const initialState: BarbershopDetailsFormState = {
  success: false,
  message: "",
}

export function BarbershopDetailsForm({
  barbershop,
}: BarbershopDetailsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateBarbershopDetails,
    initialState,
  )

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nome da barbearia</Label>
          <Input
            id="name"
            name="name"
            defaultValue={barbershop.name}
            required
            maxLength={100}
            className="h-10"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Endereço completo</Label>
          <Input
            id="address"
            name="address"
            defaultValue={barbershop.address}
            placeholder="Rua, número e bairro"
            required
            maxLength={240}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            name="cidade"
            defaultValue={barbershop.cidade ?? ""}
            maxLength={100}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            defaultValue={barbershop.instagram ?? ""}
            placeholder="@sua_barbearia"
            maxLength={100}
            className="h-10"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="phones">Números de contato</Label>
          <Textarea
            id="phones"
            name="phones"
            defaultValue={barbershop.phones.join("\n")}
            placeholder={"(11) 99999-9999\n(11) 3333-3333"}
            required
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Informe um número por linha. Você pode cadastrar até 3 contatos.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="horarioAbertura">Horário de abertura</Label>
          <Input
            id="horarioAbertura"
            name="horarioAbertura"
            type="time"
            defaultValue={barbershop.horarioAbertura ?? ""}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horarioFechamento">Horário de fechamento</Label>
          <Input
            id="horarioFechamento"
            name="horarioFechamento"
            type="time"
            defaultValue={barbershop.horarioFechamento ?? ""}
            className="h-10"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descrição da barbearia</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={barbershop.description}
            placeholder="Conte aos clientes sobre a sua barbearia."
            maxLength={1000}
            rows={5}
          />
        </div>
      </div>

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-xl border px-3 py-2 text-sm ${
            state.success
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300"
          }`}
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 bg-[#C3F32C] px-5 font-bold text-black hover:bg-[#afd925]"
      >
        {pending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Save />
        )}
        {pending ? "Salvando..." : "Salvar informações"}
      </Button>
    </form>
  )
}
