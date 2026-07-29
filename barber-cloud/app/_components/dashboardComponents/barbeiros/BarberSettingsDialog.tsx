"use client"

import { useState, useTransition } from "react"
import {
  BriefcaseBusiness,
  Clock3,
  Scissors,
  Settings2,
} from "lucide-react"
import { toast } from "sonner"

import { updateBarberSettings } from "@/app/_actions/barberSettings"
import { Button } from "@/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Input } from "@/app/_components/ui/input"
import { Switch } from "@/app/_components/ui/switch"

type Schedule = {
  weekday: number
  enabled: boolean
  startTime: string
  endTime: string
}

type AvailableService = {
  id: string
  name: string
  price: number
  duration: number
}

type ServiceConfig = {
  serviceId: string
  enabled: boolean
  customPrice: number | null
  customDuration: number | null
}

const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
]

export function BarberSettingsDialog({
  barberId,
  barberName,
  initialJobTitle,
  initialIsActive,
  initialSchedules,
  availableServices,
  initialServiceConfigs,
  defaultStartTime,
  defaultEndTime,
}: {
  barberId: string
  barberName: string
  initialJobTitle: string
  initialIsActive: boolean
  initialSchedules: Schedule[]
  availableServices: AvailableService[]
  initialServiceConfigs: ServiceConfig[]
  defaultStartTime: string
  defaultEndTime: string
}) {
  const buildSchedules = () =>
    DAYS.map((_, weekday) => {
      const saved = initialSchedules.find(
        (schedule) => schedule.weekday === weekday,
      )
      return (
        saved ?? {
          weekday,
          enabled: weekday !== 0,
          startTime: defaultStartTime,
          endTime: defaultEndTime,
        }
      )
    })

  const [open, setOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState(initialJobTitle)
  const [isActive, setIsActive] = useState(initialIsActive)
  const [schedules, setSchedules] = useState<Schedule[]>(buildSchedules)
  const [services, setServices] = useState<ServiceConfig[]>(() =>
    availableServices.map((service) => {
      const saved = initialServiceConfigs.find(
        (config) => config.serviceId === service.id,
      )
      return (
        saved ?? {
          serviceId: service.id,
          enabled: true,
          customPrice: null,
          customDuration: null,
        }
      )
    }),
  )
  const [pending, startTransition] = useTransition()

  const updateSchedule = (
    weekday: number,
    changes: Partial<Omit<Schedule, "weekday">>,
  ) => {
    setSchedules((current) =>
      current.map((schedule) =>
        schedule.weekday === weekday ? { ...schedule, ...changes } : schedule,
      ),
    )
  }

  const save = () => {
    startTransition(async () => {
      try {
        await updateBarberSettings({
          barberId,
          jobTitle,
          isActive,
          schedules,
          services,
        })
        toast.success("Configurações do funcionário salvas.")
        setOpen(false)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível salvar as configurações.",
        )
      }
    })
  }

  const updateService = (
    serviceId: string,
    changes: Partial<Omit<ServiceConfig, "serviceId">>,
  ) => {
    setServices((current) =>
      current.map((service) =>
        service.serviceId === serviceId
          ? { ...service, ...changes }
          : service,
      ),
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer gap-2">
          <Settings2 />
          Configurar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl p-0 leading-normal">
        <DialogHeader className="shrink-0 border-b px-5 py-5 pr-12 sm:px-6">
          <DialogTitle className="text-lg leading-tight">
            Configurar {barberName}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Defina o cargo, a disponibilidade e a jornada semanal.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 min-w-0 space-y-6 overflow-x-hidden overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-5 rounded-xl border bg-muted/20 p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">
                Funcionário ativo
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Quando inativo, não recebe novos agendamentos.
              </p>
            </div>
            <Switch
              className="shrink-0"
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Funcionário ativo"
            />
          </div>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <BriefcaseBusiness className="size-4" />
              Cargo
            </span>
            <Input
              className="h-10"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              maxLength={50}
              placeholder="Ex.: Barbeiro sênior, Gerente"
            />
          </label>

          <div className="space-y-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Scissors className="size-4" />
                Serviços realizados
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Desative serviços ou personalize preço e duração para este
                profissional.
              </p>
            </div>
            <div className="min-w-0 divide-y overflow-hidden rounded-xl border">
              {availableServices.map((service) => {
                const config = services.find(
                  (item) => item.serviceId === service.id,
                )!
                return (
                  <div key={service.id} className="space-y-3 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {service.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Padrão: R$ {service.price.toFixed(2)} ·{" "}
                          {service.duration} min
                        </p>
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(enabled) =>
                          updateService(service.id, { enabled })
                        }
                        aria-label={`${service.name} realizado pelo funcionário`}
                      />
                    </div>
                    {config.enabled && (
                      <div className="grid grid-cols-2 gap-2">
                        <label className="space-y-1">
                          <span className="text-[11px] text-muted-foreground">
                            Preço personalizado
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={service.price.toFixed(2)}
                            value={config.customPrice ?? ""}
                            onChange={(event) =>
                              updateService(service.id, {
                                customPrice: event.target.value
                                  ? Number(event.target.value)
                                  : null,
                              })
                            }
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-[11px] text-muted-foreground">
                            Duração em minutos
                          </span>
                          <Input
                            type="number"
                            min="5"
                            max="720"
                            step="5"
                            placeholder={String(service.duration)}
                            value={config.customDuration ?? ""}
                            onChange={(event) =>
                              updateService(service.id, {
                                customDuration: event.target.value
                                  ? Number(event.target.value)
                                  : null,
                              })
                            }
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="size-4" />
                Jornada de trabalho
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Ative os dias trabalhados e informe entrada e saída.
              </p>
            </div>

            <div className="min-w-0 divide-y overflow-hidden rounded-xl border">
              {schedules.map((schedule) => (
                <div
                  key={schedule.weekday}
                  className="min-w-0 grid items-center gap-3 p-3 sm:grid-cols-[120px_minmax(0,1fr)]"
                >
                  <div className="flex items-center gap-2">
                    <Switch
                      size="sm"
                      checked={schedule.enabled}
                      onCheckedChange={(enabled) =>
                        updateSchedule(schedule.weekday, { enabled })
                      }
                      aria-label={`Trabalha em ${DAYS[schedule.weekday]}`}
                    />
                    <span className="text-sm">{DAYS[schedule.weekday]}</span>
                  </div>
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <Input
                      type="time"
                      aria-label={`Entrada de ${DAYS[schedule.weekday]}`}
                      value={schedule.startTime}
                      disabled={!schedule.enabled}
                      className="h-9 min-w-0 px-2 text-xs sm:text-sm [&::-webkit-calendar-picker-indicator]:hidden"
                      onChange={(event) =>
                        updateSchedule(schedule.weekday, {
                          startTime: event.target.value,
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground">até</span>
                    <Input
                      type="time"
                      aria-label={`Saída de ${DAYS[schedule.weekday]}`}
                      value={schedule.endTime}
                      disabled={!schedule.enabled}
                      className="h-9 min-w-0 px-2 text-xs sm:text-sm [&::-webkit-calendar-picker-indicator]:hidden"
                      onChange={(event) =>
                        updateSchedule(schedule.weekday, {
                          endTime: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-x-0 border-b-0 px-5 py-4 sm:px-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button onClick={save} disabled={pending || !jobTitle.trim()}>
            {pending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
