import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  Check,
  Users,
} from "lucide-react"

import LandingPhoneBookingDemo from "./_components/landing-phone-booking-demo"
import ScrollPhoneCta from "./_components/scroll-phone-cta"
import {
  MotionArticle,
  MotionDiv,
  MotionSection,
  TransitionLink,
} from "./_components/landing-motion"
import styles from "./landing.module.css"

export const metadata: Metadata = {
  title: {
    absolute: "Régua Máxima - Sistema para Barbearias",
  },
  description:
    "Organize agendamentos, clientes, equipe e finanças da sua barbearia em um único sistema.",
}

const features = [
  {
    icon: CalendarCheck2,
    title: "Agendamento online",
    description:
      "Seus clientes escolhem o serviço, profissional, dia e horário sem depender de mensagens.",
  },
  {
    icon: Users,
    title: "Clientes e equipe",
    description:
      "Centralize o histórico dos clientes e organize os profissionais da sua barbearia.",
  },
  {
    icon: BarChart3,
    title: "Controle financeiro",
    description:
      "Acompanhe entradas, resultados e informações importantes para tomar decisões melhores.",
  },
]

const plans = [
  { name: "Básico", price: 29, description: "Para começar com organização." },
  { name: "Pro", price: 59, description: "Para barbearias em crescimento." },
  {
    name: "Premium",
    price: 99,
    description: "Para operações maiores e completas.",
  },
]

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <MotionSection className={styles.hero}>
        <MotionDiv className={styles.heroContent}>
          <Image
            className={styles.mobileHeroLogo}
            src="/LogoMComBorder3.png"
            alt="Logo da Régua Máxima"
            width={88}
            height={58}
            priority
          />
          <h1>
            Faça sua <span className="shine-text">barbearia</span> faturar mais
          </h1>
          <p>
            Organize agendamentos, clientes, equipe e finanças em um único
            sistema. Tenha mais controle da sua barbearia, economize tempo e
            ofereça uma experiência ainda melhor para seus clientes.
          </p>
          <div className={styles.heroActions}>
            <TransitionLink href="/inicio" className={styles.primaryButton}>
              Entrar
              <ArrowRight aria-hidden="true" />
            </TransitionLink>
            <Link href="#como-funciona" className={styles.secondaryButton}>
              Ver como funciona
            </Link>
          </div>
          <div className={styles.trustLine}>
            <span>
              <Check aria-hidden="true" /> Agenda organizada
            </span>
            <span>
              <Check aria-hidden="true" /> Gestão em um só lugar
            </span>
          </div>
        </MotionDiv>

        <MotionDiv
          className={styles.phoneArea}
          aria-label="Demonstração do sistema"
          delay={0.18}
          distance={18}
        >
          <div className={styles.phone}>
            <span className={styles.volumeButtons} aria-hidden="true" />
            <span className={styles.powerButton} aria-hidden="true" />
            <span className={styles.dynamicIsland} aria-hidden="true">
              <i />
            </span>
            <LandingPhoneBookingDemo />
          </div>
        </MotionDiv>
      </MotionSection>

      <MotionSection className={styles.section} id="recursos">
        <div className={styles.sectionIntro}>
          <span>Recursos</span>
          <h2>O essencial para organizar sua operação</h2>
          <p>
            Menos tarefas manuais e mais tempo para cuidar dos clientes e fazer
            sua barbearia crescer.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <MotionArticle
              key={feature.title}
              className={`${styles.featureCard} ${
                index === 0
                  ? styles.imageFeatureCard
                  : index === 1
                    ? styles.photoFeatureCard
                    : styles.productFeatureCard
              }`}
              delay={index * 0.09}
            >
              {index === 0 ? (
                <>
                  <div className={styles.imageFeatureCopy}>
                    <span>Agendamento online</span>
                    <h3>
                      Organize sua agenda.
                      <br />
                      Em qualquer dispositivo.
                    </h3>
                  </div>
                  <div className={styles.featureImage}>
                    <Image
                      src="/fotoCard1-v2.png"
                      alt="Sistema Régua Máxima em celular, tablet e computador"
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                  </div>
                </>
              ) : index === 1 ? (
                <>
                  <div className={styles.photoFeatureImage}>
                    <Image
                      src="/card2foto.png"
                      alt="Equipe da Régua Máxima atendendo clientes"
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                  </div>
                  <div className={styles.photoFeatureShade} aria-hidden="true" />
                  <div className={styles.photoFeatureCopy}>
                    <span>Clientes e equipe</span>
                    <h3>
                      Pessoas conectadas.
                      <br />
                      Gestão simplificada.
                    </h3>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.productFeatureCopy}>
                    <span>Controle financeiro</span>
                    <h3>
                      Decisões melhores.
                      <br />
                      Resultados maiores.
                    </h3>
                    <p>Acompanhe sua operação com clareza.</p>
                  </div>
                  <div className={styles.productFeatureImage}>
                    <Image
                      src="/card3foto.png"
                      alt="Máquina profissional da Régua Máxima"
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                  </div>
                </>
              )}
            </MotionArticle>
          ))}
        </div>
      </MotionSection>

      <MotionSection className={styles.stepsSection} id="como-funciona">
        <div className={styles.sectionIntro}>
          <span>Como funciona</span>
          <h2>Comece em poucos passos</h2>
        </div>
        <div className={styles.stepsGrid}>
          {[
            ["01", "Cadastre sua barbearia", "Informe serviços, equipe e horários."],
            ["02", "Receba agendamentos", "Seus clientes reservam pela plataforma."],
            ["03", "Acompanhe os resultados", "Visualize sua operação com clareza."],
          ].map(([number, title, description], index) => (
            <MotionArticle key={number} delay={index * 0.09}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </MotionArticle>
          ))}
        </div>
      </MotionSection>

      <MotionSection className={styles.section} id="planos">
        <div className={styles.sectionIntro}>
          <span>Planos</span>
          <h2>Escolha o plano da sua barbearia</h2>
          <p>Comece com o que precisa hoje e evolua quando sua operação crescer.</p>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan, index) => (
            <MotionArticle
              key={plan.name}
              className={`${styles.planCard} ${index === 1 ? styles.featuredPlan : ""}`}
              delay={index * 0.09}
            >
              {index === 1 && <span className={styles.planBadge}>Mais escolhido</span>}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className={styles.price}>
                <span>R$</span>
                <strong>{plan.price}</strong>
                <span>/mês</span>
              </div>
              <Link href="/login">Começar agora</Link>
            </MotionArticle>
          ))}
        </div>
      </MotionSection>

      <ScrollPhoneCta />

    </main>
  )
}
