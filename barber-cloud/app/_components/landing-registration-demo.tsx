"use client"

import Image from "next/image"
import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  MapPin,
  Phone,
  Scissors,
  Users,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

import styles from "../landing.module.css"

const steps = [
  {
    label: "Dados da barbearia",
    shortLabel: "Dados",
    sidebarLabel: "Barbearia",
    description: "Dados principais",
    icon: Building2,
  },
  {
    label: "Equipe e servi\u00e7os",
    shortLabel: "Equipe",
    sidebarLabel: "Equipe e servi\u00e7os",
    description: "Profissionais e cat\u00e1logo",
    icon: Scissors,
  },
  {
    label: "Hor\u00e1rios",
    shortLabel: "Hor\u00e1rios",
    sidebarLabel: "Hor\u00e1rios",
    description: "Disponibilidade",
    icon: Clock3,
  },
]

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "S\u00e1b", "Dom"]
const autoStepDuration = 5200

export default function LandingRegistrationDemo() {
  const demoRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(demoRef, { once: true, amount: 0.14 })
  const isDemoVisible = useInView(demoRef, { amount: 0.14 })
  const [activeStep, setActiveStep] = useState(0)
  const [selectedDays, setSelectedDays] = useState(["Seg", "Ter", "Qua", "Qui", "Sex"])
  const [openTime, setOpenTime] = useState("09:00")
  const [closeTime, setCloseTime] = useState("19:00")
  const [interval, setIntervalMinutes] = useState("30")
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!isDemoVisible) return

    const timeout = window.setTimeout(() => {
      setCompleted(false)
      setActiveStep((step) => (step + 1) % steps.length)
    }, autoStepDuration)

    return () => window.clearTimeout(timeout)
  }, [activeStep, isDemoVisible])

  function selectStep(index: number) {
    setActiveStep(index)
    setCompleted(false)
  }

  function toggleDay(day: string) {
    setSelectedDays((days) =>
      days.includes(day) ? days.filter((item) => item !== day) : [...days, day],
    )
  }

  function advanceStep() {
    if (activeStep < steps.length - 1) {
      setActiveStep((step) => step + 1)
      return
    }

    setCompleted(true)
  }

  return (
    <div ref={demoRef} className={styles.demoMotionStage}>
      <motion.div
        className={styles.registrationDemo}
        initial={reduceMotion ? false : { opacity: 0, y: 145, scale: 0.955 }}
        animate={
          reduceMotion || isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 145, scale: 0.955 }
        }
        transition={{
          delay: reduceMotion ? 0 : 0.32,
          duration: 1.15,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={styles.demoBrowserBar}>
          <div aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>app.reguamaxima.com/cadastro</span>
        </div>

        <div className={styles.demoWorkspace}>
          <aside className={styles.demoProgress}>
            <div className={styles.demoProgressBrand}>
              <Image src="/LogoMComBorder3.png" alt="" width={58} height={38} />
              <span>Configuração inicial</span>
            </div>

            <ol>
              {steps.map((step, index) => {
                const Icon = step.icon

                return (
                  <motion.li
                    key={step.label}
                    initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                    animate={
                      reduceMotion || isInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -18 }
                    }
                    transition={{
                      delay: reduceMotion ? 0 : 0.72 + index * 0.1,
                      duration: 0.48,
                    }}
                  >
                    <button
                      type="button"
                      className={index === activeStep ? styles.activeDemoStep : ""}
                      onClick={() => selectStep(index)}
                    >
                      <span><Icon aria-hidden="true" /></span>
                      <div>
                        <strong>{step.sidebarLabel}</strong>
                        <small>{step.description}</small>
                      </div>
                    </button>
                  </motion.li>
                )
              })}
            </ol>
          </aside>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeStep}-${isInView ? "visible" : "hidden"}`}
              className={styles.demoFormPanel}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className={styles.demoFormHeading}
                initial={false}
                animate={
                  reduceMotion || isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 22 }
                }
                transition={{
                  delay: reduceMotion ? 0 : 0.52,
                  duration: 0.52,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span>Etapa {activeStep + 1} de {steps.length}</span>
                <h3>
                  {activeStep === 0 && "Conte um pouco sobre sua barbearia"}
                  {activeStep === 1 && "Adicione sua equipe e seus servi\u00e7os"}
                  {activeStep === 2 && "Defina seus dias e hor\u00e1rios"}
                </h3>
                <p>
                  {activeStep === 0 && "Essas informa\u00e7\u00f5es aparecer\u00e3o para seus clientes."}
                  {activeStep === 1 && "Voc\u00ea poder\u00e1 editar profissionais e valores quando quiser."}
                  {activeStep === 2 && "Selecione os dias em que sua barbearia recebe agendamentos."}
                </p>
              </motion.div>

            {activeStep === 0 && (
              <motion.div
                className={styles.demoFormGrid}
                initial={false}
                animate={
                  reduceMotion || isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 22 }
                }
                transition={{
                  delay: reduceMotion ? 0 : 0.68,
                  duration: 0.56,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <label className={styles.demoFullField}>
                  <span>Nome da barbearia</span>
                  <div className={styles.demoFieldControl}>
                    <Building2 aria-hidden="true" />
                    <input defaultValue="Barbearia R\u00e9gua M\u00e1xima" />
                  </div>
                </label>
                <label>
                  <span>Telefone</span>
                  <div className={styles.demoFieldControl}>
                    <Phone aria-hidden="true" />
                    <input defaultValue="(11) 99999-9999" />
                  </div>
                </label>
                <label>
                  <span>CEP</span>
                  <div className={styles.demoFieldControl}>
                    <MapPin aria-hidden="true" />
                    <input defaultValue="01001-000" />
                  </div>
                </label>
                <label className={styles.demoFullField}>
                  <span>Endereço</span>
                  <div className={styles.demoFieldControl}>
                    <MapPin aria-hidden="true" />
                    <input defaultValue="Rua da Barbearia, 120" />
                  </div>
                </label>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                className={styles.demoFormGrid}
                initial={false}
                animate={
                  reduceMotion || isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 22 }
                }
                transition={{
                  delay: reduceMotion ? 0 : 0.68,
                  duration: 0.56,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <label className={styles.demoFullField}>
                  <span>Serviço</span>
                  <div className={styles.demoFieldControl}>
                    <Scissors aria-hidden="true" />
                    <input defaultValue="Corte + Barba" />
                  </div>
                </label>
                <label>
                  <span>Duração</span>
                  <div className={styles.demoFieldControl}>
                    <Clock3 aria-hidden="true" />
                    <input defaultValue="45 minutos" />
                  </div>
                </label>
                <label>
                  <span>Valor</span>
                  <div className={styles.demoFieldControl}>
                    <span>R$</span>
                    <input defaultValue="65,00" />
                  </div>
                </label>
                <label className={styles.demoFullField}>
                  <span>Profissional</span>
                  <div className={styles.demoFieldControl}>
                    <Users aria-hidden="true" />
                    <input defaultValue="Jo\u00e3o Silva" />
                  </div>
                </label>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                className={styles.demoSchedule}
                initial={false}
                animate={
                  reduceMotion || isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 22 }
                }
                transition={{
                  delay: reduceMotion ? 0 : 0.68,
                  duration: 0.56,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span>Dias de atendimento</span>
                <div className={styles.demoDays}>
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={selectedDays.includes(day) ? styles.activeDemoDay : ""}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className={styles.demoTimeFields}>
                  <label>
                    <span>Abre às</span>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(event) => setOpenTime(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Fecha às</span>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(event) => setCloseTime(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Intervalo entre horários</span>
                    <select
                      value={interval}
                      onChange={(event) => setIntervalMinutes(event.target.value)}
                    >
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">60 minutos</option>
                    </select>
                  </label>
                </div>

                <div className={styles.demoSchedulePreview}>
                  <span><Clock3 aria-hidden="true" /></span>
                  <div>
                    <strong>Agenda configurada</strong>
                    <small>
                      {selectedDays.length} dias ativos · {openTime} às {closeTime} · intervalos de {interval} min
                    </small>
                  </div>
                  <b>Ativa</b>
                </div>
              </motion.div>
            )}

            <motion.div
              className={styles.demoFormFooter}
              initial={false}
              animate={
                reduceMotion || isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 22 }
              }
              transition={{
                delay: reduceMotion ? 0 : 0.84,
                duration: 0.56,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <small>
                {completed
                  ? "Configura\u00e7\u00e3o conclu\u00edda com sucesso."
                  : "As informa\u00e7\u00f5es podem ser alteradas depois."}
              </small>
              <button type="button" onClick={advanceStep}>
                {completed ? (
                  <>Concluído <Check aria-hidden="true" /></>
                ) : (
                  <>{activeStep === steps.length - 1 ? "Concluir" : "Salvar e continuar"} <ArrowRight aria-hidden="true" /></>
                )}
              </button>
            </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  )
}
