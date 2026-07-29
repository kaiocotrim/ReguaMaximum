"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import {
  createBooking,
  getAvailableBarberIdsForDate,
  getAvailableTimesForBarber,
} from "@/app/_lib/create-booking"
import { BadgeCheck, CalendarDays } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ptBR } from "date-fns/locale"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { useSearchParams } from "next/navigation"

type BarberOption = {
  id: string
  avatar: string | null
  user: {
    name: string | null
  }
  serviceConfig: {
    enabled: boolean
    customPrice: number | null
    customDuration: number | null
  } | null
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

interface ServiceItemProps {
  service: {
    id: string
    name: string
    description: string
    imageUrl: string
    price: number
    duration: number
  }
  barbershopId: string
  barbers: BarberOption[]
  acceptsBookings?: boolean
}

const ServiceItem = ({
  service,
  barbershopId,
  barbers,
  acceptsBookings = true,
}: ServiceItemProps) => {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const rescheduleBookingId =
    searchParams.get("service") === service.id
      ? searchParams.get("reschedule") ?? undefined
      : undefined
  const [bookingDialogOpen, setBookingDialogOpen] = useState(
    searchParams.get("service") === service.id,
  )

  const [selectDay, setSelectedDay] = useState<Date>()
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableBarberIds, setAvailableBarberIds] = useState<string[]>([])
  const [firstTimes, setFirstTimes] = useState<Record<string, string>>({})
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isCheckingBarbers, setIsCheckingBarbers] = useState(false)
  const [isCheckingTimes, setIsCheckingTimes] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const resetSelection = () => {
    setSelectedDay(undefined)
    setSelectedBarber(null)
    setSelectedTime(null)
    setAvailableBarberIds([])
    setFirstTimes({})
    setAvailableTimes([])
    setIsCheckingBarbers(false)
    setIsCheckingTimes(false)
    setBookingSuccess(false)
    setBookingError("")
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedBarber(null)
    setSelectedTime(null)
    setAvailableBarberIds([])
    setFirstTimes({})
    setAvailableTimes([])
    setBookingError("")
    setIsCheckingBarbers(Boolean(date))
  }

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId)
    setSelectedTime(null)
    setAvailableTimes([])
    setBookingError("")
    setIsCheckingTimes(true)
  }

  useEffect(() => {
    if (!selectDay) return

    let cancelled = false
    getAvailableBarberIdsForDate({
      barbershopId,
      serviceId: service.id,
      date: dateKey(selectDay),
    })
      .then((result) => {
        if (cancelled) return
        setAvailableBarberIds(result.barberIds)
        setFirstTimes(result.firstTimes)
        if (!result.success) setBookingError(result.error)
      })
      .finally(() => {
        if (!cancelled) setIsCheckingBarbers(false)
      })

    return () => {
      cancelled = true
    }
  }, [barbershopId, selectDay, service.id])

  useEffect(() => {
    if (!selectDay || !selectedBarber) return

    let cancelled = false
    getAvailableTimesForBarber({
      barbershopId,
      serviceId: service.id,
      barberId: selectedBarber,
      date: dateKey(selectDay),
    })
      .then((result) => {
        if (cancelled) return
        setAvailableTimes(result.times)
        setSelectedTime((current) =>
          current && result.times.includes(current) ? current : null,
        )
        if (!result.success) setBookingError(result.error)
      })
      .finally(() => {
        if (!cancelled) setIsCheckingTimes(false)
      })

    return () => {
      cancelled = true
    }
  }, [barbershopId, selectDay, selectedBarber, service.id])

  const refreshAvailabilityAfterConflict = async () => {
    if (!selectDay || !selectedBarber) return

    const [barberResult, timeResult] = await Promise.all([
      getAvailableBarberIdsForDate({
        barbershopId,
        serviceId: service.id,
        date: dateKey(selectDay),
      }),
      getAvailableTimesForBarber({
        barbershopId,
        serviceId: service.id,
        barberId: selectedBarber,
        date: dateKey(selectDay),
      }),
    ])

    setAvailableBarberIds(barberResult.barberIds)
    setFirstTimes(barberResult.firstTimes)
    setAvailableTimes(timeResult.times)
    setSelectedTime((current) =>
      current && timeResult.times.includes(current) ? current : null,
    )

    if (!barberResult.barberIds.includes(selectedBarber)) {
      setSelectedBarber(null)
      setAvailableTimes([])
    }
  }

  const handleBooking = async () => {
    if (!selectDay || !selectedBarber || !selectedTime) return
    if (!session?.user?.id) {
      setBookingError("Faça login para concluir o agendamento.")
      return
    }

    setIsBooking(true)
    setBookingError("")

    try {
      const result = await createBooking({
        barbershopId,
        serviceId: service.id,
        barberId: selectedBarber,
        date: dateKey(selectDay),
        time: selectedTime,
        rescheduleBookingId,
      })

      if (result.success) {
        setAvailableTimes((times) =>
          times.filter((time) => time !== selectedTime),
        )
        setBookingSuccess(true)
      } else {
        setBookingError(result.error)
        await refreshAvailabilityAfterConflict()
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error)
      setBookingError("Não foi possível concluir o agendamento.")
    } finally {
      setIsBooking(false)
    }
  }

  const availableBarbers = barbers.filter((barber) =>
    availableBarberIds.includes(barber.id),
  )
  const selectedBarberName =
    barbers.find((barber) => barber.id === selectedBarber)?.user.name ??
    "Barbeiro"

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mb-3 flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-3 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_14px_30px_rgba(37,79,80,0.10)] lg:mb-0 lg:min-h-[140px]">
      <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px] overflow-hidden rounded-xl">
        <Image
          src={service.imageUrl || "/maquina.png"}
          alt={service.name}
          fill
          sizes="110px"
          className="rounded-xl border-2 border-[#C3F32C]/40 object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
      </div>

      <div className="flex-1 space-y-2 pr-2">
        <h3 className="animate-in fade-in slide-in-from-left-2 text-base font-bold tracking-wide text-foreground delay-100 dark:text-primary">
          {service.name}
        </h3>
        <p className="animate-in fade-in line-clamp-2 text-xs leading-relaxed text-muted-foreground delay-150">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <p className="animate-in fade-in text-lg font-bold text-foreground delay-200">
            R${" "}
            <span className="animate-pulse text-foreground dark:text-primary [animation-duration:3s]">
              {service.price.toFixed(2)}
            </span>
          </p>

          <Dialog
            open={bookingDialogOpen}
            onOpenChange={(open) => {
              setBookingDialogOpen(open)
              if (!open) resetSelection()
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                disabled={!acceptsBookings}
                className="relative ml-auto cursor-pointer justify-center overflow-hidden rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:scale-105 hover:bg-[#d4ff3a] hover:shadow-[0_0_16px_rgba(195,243,44,0.6)] hover:before:translate-x-full active:scale-95 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {acceptsBookings ? "Agendar" : "Pausado"}
              </Button>
            </DialogTrigger>

            <DialogContent className="fixed !right-0 bottom-0 !left-0 top-auto max-h-[88vh] !w-auto min-w-0 !max-w-none !translate-x-0 translate-y-0 gap-0 overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-3xl rounded-b-none border-border bg-popover p-0 text-popover-foreground lg:top-1/2 lg:!right-auto lg:bottom-auto lg:!left-1/2 lg:max-h-[90vh] lg:!w-[min(1080px,calc(100vw-3rem))] lg:!-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-3xl">
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-muted lg:hidden" />
              <DialogHeader className="border-b border-border/70 px-5 py-4 text-left lg:px-8 lg:py-6">
                <DialogTitle className="animate-in fade-in slide-in-from-top-2 text-lg font-bold text-foreground lg:text-2xl">
                  Agende seu horário
                </DialogTitle>
                <p className="hidden text-sm leading-6 text-muted-foreground lg:block">
                  {service.name} · R$ {service.price.toFixed(2)}
                </p>
              </DialogHeader>

              {bookingSuccess ? (
                <div className="animate-in fade-in zoom-in-95 flex min-h-72 flex-col items-center justify-center gap-4 p-10 text-center duration-500 lg:min-h-[540px]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C3F32C] shadow-[0_12px_32px_rgba(195,243,44,0.3)] lg:h-20 lg:w-20">
                    <BadgeCheck className="h-8 w-8 text-[#254F50] lg:h-10 lg:w-10" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    Agendamento confirmado!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectDay?.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                    })}{" "}
                    às {selectedTime}, com {selectedBarberName}
                  </p>
                </div>
              ) : (
                <div className="min-w-0 max-w-full overflow-x-hidden lg:grid lg:min-h-[540px] lg:grid-cols-[360px_minmax(0,1fr)]">
                  <div
                    className={`animate-in fade-in zoom-in-95 duration-300 lg:row-span-6 lg:block lg:border-r lg:border-border/70 lg:bg-muted/20 lg:p-6 ${
                      selectDay ? "hidden" : ""
                    }`}
                  >
                      <p className="px-5 pt-2 text-center text-sm font-semibold text-foreground lg:px-0 lg:pt-0 lg:text-left lg:text-base">
                        <span className="lg:hidden">1. </span>Escolha a data
                      </p>
                      <div className="flex justify-center p-4 lg:p-0 lg:pt-5">
                        <Calendar
                          className="w-fit rounded-xl bg-popover p-3 text-popover-foreground lg:w-full lg:border lg:border-border/60 lg:p-5 lg:shadow-sm"
                          mode="single"
                          locale={ptBR}
                          selected={selectDay}
                          onSelect={handleDateSelect}
                          disabled={{ before: new Date() }}
                          classNames={{
                            caption_label: "text-primary font-bold",
                            weekday: "text-muted-foreground font-semibold",
                            day: "text-foreground hover:bg-primary hover:text-[#254F50] rounded-md cursor-pointer",
                            selected:
                              "!bg-primary !text-[#254F50] rounded-md",
                            today:
                              "!bg-accent !text-accent-foreground rounded-md",
                            button_previous:
                              "text-primary hover:bg-accent rounded-md",
                            button_next:
                              "text-primary hover:bg-accent rounded-md",
                          }}
                        />
                      </div>
                    </div>

                  {!selectDay && (
                    <div className="hidden flex-col items-center justify-center px-12 text-center lg:flex">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <CalendarDays className="h-7 w-7" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        Comece escolhendo uma data
                      </p>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                        Em seguida mostraremos somente os barbeiros e horários
                        realmente disponíveis.
                      </p>
                    </div>
                  )}

                  {selectDay && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 lg:min-w-0">
                      <div className="mx-5 mb-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 ring-1 ring-border lg:mx-7 lg:mt-6 lg:mb-5 lg:px-5 lg:py-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Data escolhida
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {selectDay.toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                            })}
                          </p>
                        </div>
                        <button
                          onClick={resetSelection}
                          className="cursor-pointer text-xs font-medium text-primary underline underline-offset-2"
                        >
                          Trocar data
                        </button>
                      </div>

                      <p className="px-5 pb-3 text-sm font-semibold text-foreground/80 lg:px-7 lg:text-base">
                        2. Escolha um barbeiro disponível
                      </p>

                      {isCheckingBarbers ? (
                        <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                          Consultando barbeiros...
                        </p>
                      ) : availableBarbers.length === 0 ? (
                        <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                          Não há barbeiros com horários disponíveis nesta data.
                        </p>
                      ) : (
                        <div
                          data-vaul-no-drag
                          className="flex gap-4 overflow-auto px-5 pt-1 pb-6 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-7 [&::-webkit-scrollbar]:hidden"
                        >
                          {availableBarbers.map((barber, index) => {
                            const isSelected = selectedBarber === barber.id
                            const initials = (barber.user.name ?? "?")
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()

                            return (
                              <button
                                key={barber.id}
                                type="button"
                                onClick={() => handleBarberSelect(barber.id)}
                                style={{
                                  animationDelay: `${index * 60}ms`,
                                }}
                                className={`animate-in fade-in slide-in-from-bottom-3 flex min-w-[120px] cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 lg:min-w-0 ${
                                  isSelected
                                    ? "border-[#C3F32C] bg-[#C3F32C]/10 shadow-[0_0_16px_rgba(195,243,44,0.2)]"
                                    : "border-border bg-muted/40 hover:border-primary/40"
                                }`}
                              >
                                <div
                                  className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full text-sm font-bold ring-2 ring-offset-2 ring-offset-popover ${
                                    isSelected
                                      ? "bg-[#C3F32C] text-[#254F50] ring-[#C3F32C]"
                                      : "bg-muted text-foreground ring-transparent"
                                  }`}
                                >
                                  {barber.avatar ? (
                                    <Image
                                      src={barber.avatar}
                                      alt={barber.user.name ?? "Barbeiro"}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    initials
                                  )}
                                </div>
                                <span className="text-center text-xs leading-tight font-semibold text-foreground">
                                  {barber.user.name ?? "Barbeiro"}
                                </span>
                                <span className="text-center text-[10px] leading-4 text-muted-foreground">
                                  {(
                                    barber.serviceConfig?.customPrice ??
                                    service.price
                                  ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                  {" · "}
                                  {barber.serviceConfig?.customDuration ??
                                    service.duration ??
                                    30}{" "}
                                  min
                                </span>
                                {firstTimes[barber.id] && (
                                  <span className="rounded-full bg-[#C3F32C]/20 px-2 py-1 text-[10px] font-semibold text-[#557500] dark:text-[#C3F32C]">
                                    Primeiro: {firstTimes[barber.id]}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {selectDay && selectedBarber && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 min-w-0 max-w-full border-t border-border/50 pt-5 duration-400 lg:mx-7 lg:pt-5">
                      <p className="px-5 pb-3 text-sm font-semibold text-foreground/80 lg:px-0 lg:text-base">
                        3. Escolha um horário com{" "}
                        <span className="text-foreground">{selectedBarberName}</span>
                      </p>

                      {isCheckingTimes ? (
                        <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                          Consultando horários...
                        </p>
                      ) : availableTimes.length === 0 ? (
                        <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                          Não há mais horários disponíveis para este barbeiro.
                        </p>
                      ) : (
                        <div
                          data-vaul-no-drag
                          className="grid max-w-full grid-cols-4 gap-2 px-5 pb-6 sm:grid-cols-5 lg:grid-cols-5 lg:gap-3 lg:px-0"
                        >
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={
                                selectedTime === time
                                  ? "default"
                                  : "secondary"
                              }
                              onClick={() => {
                                setSelectedTime(time)
                                setBookingError("")
                              }}
                              className={
                                selectedTime === time
                                  ? "w-full bg-[#C3F32C] px-2 font-bold text-[#254F50] hover:bg-[#d4ff3a]"
                                  : "w-full border border-transparent px-2 hover:border-primary/40"
                              }
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectDay && selectedBarber && selectedTime && (
                    <div className="animate-in fade-in zoom-in-95 p-5 pt-1 duration-400 lg:px-7 lg:pb-7">
                      <Button
                        onClick={handleBooking}
                        disabled={
                          isBooking ||
                          isCheckingTimes ||
                          !availableTimes.includes(selectedTime)
                        }
                        className="relative h-11 w-full cursor-pointer overflow-hidden rounded-xl bg-[#C3F32C] font-bold text-[#254F50] hover:bg-[#d4ff3a] disabled:cursor-not-allowed disabled:opacity-60 lg:h-12"
                      >
                        {isBooking
                          ? "Confirmando..."
                          : `Confirmar para ${selectedTime}`}
                      </Button>
                    </div>
                  )}

                  {bookingError && (
                    <p className="px-5 pb-3 text-center text-sm leading-5 text-red-500 lg:px-7 lg:pb-6">
                      {bookingError}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-border/70 p-4 lg:hidden">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer transition-all duration-150 active:scale-95"
                  >
                    Fechar
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
