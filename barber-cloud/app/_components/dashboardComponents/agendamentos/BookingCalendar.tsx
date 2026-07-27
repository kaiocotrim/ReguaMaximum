"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import type { EventContentArg, EventInput } from "@fullcalendar/core"
import {
  CalendarDays,
  Clock3,
  DollarSign,
  Phone,
  Pencil,
  Scissors,
  Store,
  UserRound,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"
import { CancelBookingButton } from "./CancelBookingButton"
import { DeleteBookingButton } from "./DeleteBookingButton"
import { WhatsAppButton } from "./WhatsAppButton"
import { updateBookingDetails } from "@/app/_actions/updateBookingDetails"
import { toast } from "sonner"

type BookingEvent = EventInput & {
  extendedProps: {
    client: string
    phone: string | null
    barberId: string
    barber: string
    barbershop: string
    serviceId: string
    service: string
    duration: number
    price: number
    status: "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO"
  }
}

const statusLabel = {
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
} as const

function EventContent({ event, timeText }: EventContentArg) {
  const details = event.extendedProps as BookingEvent["extendedProps"]

  return (
    <div className="min-w-0 px-1 py-0.5 leading-tight">
      <div className="flex items-center gap-1">
        <span className="shrink-0 text-[10px] font-semibold">{timeText}</span>
        <span className="truncate text-[11px] font-semibold">{details.client}</span>
      </div>
      <p className="truncate text-[10px] opacity-80">
        {details.service} · {details.barber}
      </p>
    </div>
  )
}

interface SelectOption {
  id: string
  name: string
}

export function BookingCalendar({
  events,
  barbers,
  services,
}: {
  events: BookingEvent[]
  barbers: SelectOption[]
  services: SelectOption[]
}) {
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const details = selectedEvent?.extendedProps
  const start = selectedEvent?.start ? new Date(selectedEvent.start as string) : null
  const end = selectedEvent?.end ? new Date(selectedEvent.end as string) : null

  const closeModal = () => {
    setSelectedEvent(null)
    setIsEditing(false)
  }

  const handleUpdate = (formData: FormData) => {
    if (!selectedEvent?.id) return

    const localDate = String(formData.get("date"))
    const parsedDate = new Date(localDate)
    if (Number.isNaN(parsedDate.getTime())) {
      toast.error("Informe uma data e um horário válidos.")
      return
    }

    startTransition(async () => {
      const result = await updateBookingDetails({
        bookingId: String(selectedEvent.id),
        barberId: String(formData.get("barberId")),
        serviceId: String(formData.get("serviceId")),
        date: parsedDate.toISOString(),
      })

      if (result.success) {
        toast.success("Agendamento atualizado com sucesso.")
        closeModal()
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <div className="booking-calendar min-w-0 overflow-x-auto">
        <div className="min-w-[760px]">
          <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={ptBrLocale}
          events={events}
          eventContent={EventContent}
          nowIndicator
          allDaySlot={false}
          expandRows
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          slotDuration="00:30:00"
          scrollTime="08:00:00"
          dayMaxEvents
          navLinks
          stickyHeaderDates
          firstDay={1}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
            eventClick={(info) => {
              const original = events.find((event) => event.id === info.event.id)
              if (original) setSelectedEvent(original)
            }}
            eventDidMount={(info) => {
            const details = info.event.extendedProps as BookingEvent["extendedProps"]
            info.el.title = `${details.client} — ${details.service}\n${details.barber} · ${statusLabel[details.status]}`
            }}
          />
        </div>
      </div>

      <Dialog
        open={Boolean(selectedEvent)}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null)
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl border-border bg-card p-0">
          {details && start && (
            <>
              <DialogHeader className="border-b border-border p-6 pb-5">
                <div className="flex items-start justify-between gap-4 pr-8">
                  <div>
                    <DialogTitle className="text-xl">Detalhes do agendamento</DialogTitle>
                    <DialogDescription className="mt-1">
                      Informações completas do horário selecionado.
                    </DialogDescription>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      details.status === "EM_ANDAMENTO"
                        ? "bg-[#C3F32C] text-black"
                        : details.status === "CONCLUIDO"
                          ? "bg-blue-500/15 text-blue-500"
                          : "bg-red-500/15 text-red-500"
                    }`}
                  >
                    {statusLabel[details.status]}
                  </span>
                </div>
              </DialogHeader>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                {isEditing ? (
                  <EditBookingForm
                    key={String(selectedEvent.id)}
                    details={details}
                    start={start}
                    barbers={barbers}
                    services={services}
                    isPending={isPending}
                    onCancel={() => setIsEditing(false)}
                    onSubmit={handleUpdate}
                  />
                ) : (
                  <>
                <Detail icon={UserRound} label="Cliente" value={details.client} />
                <Detail
                  icon={Phone}
                  label="Telefone"
                  value={details.phone ?? "Não informado"}
                />
                <Detail icon={Scissors} label="Serviço" value={details.service} />
                <Detail icon={UserRound} label="Barbeiro" value={details.barber} />
                <Detail icon={Store} label="Barbearia" value={details.barbershop} />
                <Detail
                  icon={DollarSign}
                  label="Valor"
                  value={details.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                />
                <Detail
                  icon={CalendarDays}
                  label="Data"
                  value={start.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <Detail
                  icon={Clock3}
                  label="Horário"
                  value={`${start.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}${end ? ` – ${end.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}` : ""} (${details.duration} min)`}
                />
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Editar agendamento"
                  aria-label="Editar agendamento"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {details.status !== "CANCELADO" && (
                  <CancelBookingButton
                    bookingId={String(selectedEvent?.id)}
                    onSuccess={closeModal}
                  />
                )}
                <DeleteBookingButton
                  bookingId={String(selectedEvent?.id)}
                  onSuccess={closeModal}
                />
                {details.phone && (
                  <div className="ml-auto">
                    <WhatsAppButton
                      telefone={details.phone}
                      nomeCliente={details.client}
                    />
                  </div>
                )}
              </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function EditBookingForm({
  details,
  start,
  barbers,
  services,
  isPending,
  onCancel,
  onSubmit,
}: {
  details: BookingEvent["extendedProps"]
  start: Date
  barbers: SelectOption[]
  services: SelectOption[]
  isPending: boolean
  onCancel: () => void
  onSubmit: (formData: FormData) => void
}) {
  const localDate = new Date(start.getTime() - start.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)

  return (
    <form action={onSubmit} className="col-span-full grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Barbeiro</span>
        <select
          name="barberId"
          defaultValue={details.barberId}
          required
          className="h-10 rounded-lg border border-border bg-background px-3"
        >
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Serviço</span>
        <select
          name="serviceId"
          defaultValue={details.serviceId}
          required
          className="h-10 rounded-lg border border-border bg-background px-3"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <label className="col-span-full grid gap-1.5 text-sm">
        <span className="font-medium">Data e horário</span>
        <input
          type="datetime-local"
          name="date"
          defaultValue={localDate}
          required
          className="h-10 rounded-lg border border-border bg-background px-3"
        />
      </label>
      <div className="col-span-full mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 cursor-pointer rounded-lg border border-border px-4 text-sm font-medium hover:bg-accent"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer rounded-lg bg-[#C3F32C] px-4 text-sm font-semibold text-black hover:bg-[#b3e023] disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon className="h-4 w-4 text-[#9fca18]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium capitalize">{value}</p>
      </div>
    </div>
  )
}
