"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, Search } from "lucide-react"

import styles from "../landing.module.css"

const categories = [
  { label: "Cabelo", icon: "/cabeloIcon.png" },
  { label: "Barba", icon: "/barbarIcon.png" },
  { label: "Acabamento", icon: "/acabamentoIcon.png" },
  { label: "Barbearias", icon: "/acabamentoIcon.png" },
]

export default function LandingPhoneDemo() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const updateClock = () => setNow(new Date())
    const initialUpdate = window.setTimeout(updateClock, 0)
    const clock = window.setInterval(updateClock, 1000)

    return () => {
      window.clearTimeout(initialUpdate)
      window.clearInterval(clock)
    }
  }, [])

  const currentTime = now
    ? now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--"

  const currentDate = now
    ? now
        .toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })
        .replace(/^./, (letter) => letter.toUpperCase())
    : "Carregando data..."

  return (
    <div className={`${styles.phoneScreen} ${styles.staticHome}`}>
      <div className={styles.staticStatusBar}>
        <strong>{currentTime}</strong>
        <div>
          <span>4G</span>
        </div>
      </div>

      <header className={styles.staticHomeHeader}>
        <Image
          src="/LogoMComBorder3.png"
          alt="Logo da Régua Máxima"
          width={54}
          height={36}
        />
        <Menu aria-hidden="true" />
      </header>

      <div className={styles.staticHomeContent}>
        <section className={styles.staticGreeting}>
          <h3>
            Olá, <span className="shine-text">iremos alinhar o cabelo?</span>
          </h3>
          <p>{currentDate}</p>
        </section>

        <div className={styles.staticSearch}>
          <span>Pesquise por barbearias e serviços...</span>
          <button type="button" aria-label="Pesquisar">
            <Search aria-hidden="true" />
          </button>
        </div>

        <div className={styles.staticCategories}>
          {categories.map((category) => (
            <span key={category.label}>
              <Image
                src={category.icon}
                alt=""
                width={13}
                height={13}
                aria-hidden="true"
              />
              {category.label}
            </span>
          ))}
        </div>

        <div className={styles.staticBanner}>
          <Image
            src="/bannerReguaM-dark1.png"
            alt="Agende nos melhores profissionais"
            fill
            sizes="330px"
          />
        </div>

        <div className={styles.staticSectionTitle}>
          <strong>Recomendações</strong>
          <span>Mapa</span>
        </div>

      </div>
    </div>
  )
}
