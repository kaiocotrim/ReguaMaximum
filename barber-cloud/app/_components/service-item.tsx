"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

import {
  createBooking,
  getAvailableBarberIdsForDate,
  getAvailableTimesForBarber,
} from "@/app/_lib/create-booking"
import {
  BarbeshopService,
  Barber,
  User,
} from "@/app/generated/prisma/client"
import { BadgeCheck } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ptBR } from "date-fns/locale"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"

type BarberWithUser = Barber & {
  user: User
}

interface ServiceItemProps {
  service: Omit<BarbeshopService, "price"> & {
    price: number
  }
  barbershopId: string
  barbers: BarberWithUser[]
}

const ServiceItem = ({ service, barbershopId, barbers }: ServiceItemProps) => {
  const { data: session } = useSession()

  const [selectDay, setSelectedDay] = useState<Date>()
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableBarberIds, setAvailableBarberIds] = useState<string[]>([])
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
      date: selectDay,
    })
      .then((result) => {
        if (cancelled) return
        setAvailableBarberIds(result.barberIds)
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
      date: selectDay,
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
        date: selectDay,
      }),
      getAvailableTimesForBarber({
        barbershopId,
        serviceId: service.id,
        barberId: selectedBarber,
        date: selectDay,
      }),
    ])

    setAvailableBarberIds(barberResult.barberIds)
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

    const [hours, minutes] = selectedTime.split(":")
    const bookingDate = new Date(selectDay)
    bookingDate.setHours(Number(hours), Number(minutes), 0, 0)

    setIsBooking(true)
    setBookingError("")

    try {
      const result = await createBooking({
        barbershopId,
        serviceId: service.id,
        barberId: selectedBarber,
        date: bookingDate,
        dayStart: selectDay,
      })

      if (result.success) {
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
    <div className="animate-in fade-in slide-in-from-bottom-4 mb-3 flex items-center gap-4 rounded-2xl border border-border bg-card p-3 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(195,243,44,0.08)]">
      <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px] overflow-hidden rounded-xl">
        <Image
          src={service.imageUrl}
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

          <Drawer
            onOpenChange={(open) => {
              if (!open) resetSelection()
            }}
          >
            <DrawerTrigger asChild>
              <Button
                size="sm"
                className="relative ml-auto cursor-pointer justify-center overflow-hidden rounded-lg bg-[#C3F32C] px-5 text-xs font-bold text-black transition-all duration-200 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 hover:scale-105 hover:bg-[#d4ff3a] hover:shadow-[0_0_16px_rgba(195,243,44,0.6)] hover:before:translate-x-full active:scale-95"
              >
                Agendar
              </Button>
            </DrawerTrigger>

            <DrawerContent className="border-border bg-popover text-popover-foreground">
              <DrawerHeader>
                <DrawerTitle className="animate-in fade-in slide-in-from-top-2 text-foreground">
                  Agende seu horário
                </DrawerTitle>
              </DrawerHeader>

              {bookingSuccess ? (
                <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-4 p-10 text-center duration-500">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C3F32C]">
                    <BadgeCheck className="h-8 w-8 text-[#254F50]" />
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
                <>
                  {!selectDay && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <p className="px-5 pt-2 text-center text-sm font-semibold text-foreground">
                        1. Escolha a data
                      </p>
                      <div className="flex justify-center p-4">
                        <Calendar
                          className="w-fit rounded-xl bg-popover p-3 text-popover-foreground"
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
                  )}

                  {selectDay && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                      <div className="mx-5 mb-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 ring-1 ring-border">
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

                      <p className="px-5 pb-3 text-sm font-semibold text-foreground/80">
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
                          className="flex gap-4 overflow-auto px-5 pt-1 pb-6 [&::-webkit-scrollbar]:hidden"
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
                                className={`animate-in fade-in slide-in-from-bottom-3 flex min-w-[120px] cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 active:scale-95 ${
                                  isSelected
                                    ? "scale-105 border-[#C3F32C] bg-[#C3F32C]/10 shadow-[0_0_16px_rgba(195,243,44,0.3)]"
                                    : "border-border bg-muted/40 hover:border-primary/40"
                                }`}
                              >
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                                    isSelected
                                      ? "bg-[#C3F32C] text-[#254F50]"
                                      : "bg-muted text-foreground"
                                  }`}
                                >
                                  {initials}
                                </div>
                                <span className="text-center text-xs leading-tight font-semibold text-foreground">
                                  {barber.user.name ?? "Barbeiro"}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {selectDay && selectedBarber && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                      <p className="px-5 pb-3 text-sm font-semibold text-foreground/80">
                        3. Escolha um horário com {selectedBarberName}
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
                          className="flex gap-3 overflow-auto px-5 pb-6 [&::-webkit-scrollbar]:hidden"
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
                                  ? "bg-[#C3F32C] text-[#254F50] hover:bg-[#d4ff3a]"
                                  : "hover:border-primary/40"
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
                    <div className="animate-in fade-in zoom-in-95 p-5 pt-1 duration-400">
                      <Button
                        onClick={handleBooking}
                        disabled={
                          isBooking ||
                          isCheckingTimes ||
                          !availableTimes.includes(selectedTime)
                        }
                        className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-[#C3F32C] font-bold text-[#254F50] hover:bg-[#d4ff3a] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBooking
                          ? "Confirmando..."
                          : `Confirmar para ${selectedTime}`}
                      </Button>
                    </div>
                  )}

                  {bookingError && (
                    <p className="px-5 pb-3 text-center text-sm text-red-500">
                      {bookingError}
                    </p>
                  )}
                </>
              )}

              <DrawerFooter className="pt-0">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-95"
                  >
                    Fechar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  )
}

export default ServiceItem
