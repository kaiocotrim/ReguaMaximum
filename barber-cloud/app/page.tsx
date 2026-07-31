import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarClock,
  CalendarCheck2,
  Check,
  ChevronDown,
  ClipboardList,
  Link2,
  Scissors,
  Users,
  WalletCards,
} from "lucide-react"

import LandingPhoneBookingDemo from "./_components/landing-phone-booking-demo"
import LandingRegistrationDemo from "./_components/landing-registration-demo"
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

const productMenuItems = [
  {
    icon: CalendarCheck2,
    title: "Agendamento online",
    description: "Reservas organizadas em poucos cliques.",
    href: "#como-funciona",
  },
  {
    icon: Users,
    title: "Gest\u00e3o de clientes",
    description: "Hist\u00f3rico e informa\u00e7\u00f5es em um s\u00f3 lugar.",
    href: "#recursos",
  },
  {
    icon: Scissors,
    title: "Equipe e profissionais",
    description: "Organize barbeiros, agendas e atendimentos.",
    href: "#recursos",
  },
  {
    icon: ClipboardList,
    title: "Servi\u00e7os e pre\u00e7os",
    description: "Gerencie seu cat\u00e1logo com facilidade.",
    href: "#recursos",
  },
  {
    icon: CalendarClock,
    title: "Hor\u00e1rios dispon\u00edveis",
    description: "Tenha controle total da disponibilidade.",
    href: "#como-funciona",
  },
  {
    icon: WalletCards,
    title: "Controle financeiro",
    description: "Acompanhe entradas e resultados da opera\u00e7\u00e3o.",
    href: "#recursos",
  },
  {
    icon: BarChart3,
    title: "Relat\u00f3rios",
    description: "M\u00e9tricas claras para decis\u00f5es melhores.",
    href: "#recursos",
  },
  {
    icon: Link2,
    title: "P\u00e1gina da barbearia",
    description: "Compartilhe seu link de agendamento.",
    href: "#como-funciona",
  },
  {
    icon: Bell,
    title: "Notifica\u00e7\u00f5es",
    description: "Mantenha equipe e clientes atualizados.",
    href: "#recursos",
  },
]

const testimonials = [
  {
    avatar: "/testimonial-avatars/avatar-01.jpg",
    name: "Mariana Costa",
    handle: "@studioimperio",
    quote:
      "A agenda ficou muito mais organizada. Hoje conseguimos visualizar a rotina inteira da equipe sem depender de mensagens.",
  },
  {
    avatar: "/testimonial-avatars/avatar-02.jpg",
    name: "Rafael Lima",
    handle: "@barbeariaroyal",
    quote:
      "O R\u00e9gua M\u00e1xima simplificou o atendimento e trouxe mais clareza para a gest\u00e3o da barbearia.",
  },
  {
    avatar: "/testimonial-avatars/avatar-03.jpg",
    name: "Jo\u00e3o Silva",
    handle: "@cortefino",
    quote:
      "Antes eu anotava tudo em lugares diferentes. Agora clientes, hor\u00e1rios, servi\u00e7os e resultados ficam centralizados.",
  },
  {
    avatar: "/testimonial-avatars/avatar-04.jpg",
    name: "Andr\u00e9 Fernandes",
    handle: "@navalhaclub",
    quote: "Ficou muito mais f\u00e1cil acompanhar os agendamentos do dia.",
  },
  {
    avatar: "/testimonial-avatars/avatar-05.jpg",
    name: "Camila Prado",
    handle: "@espacocamila",
    quote:
      "A plataforma \u00e9 simples para a equipe e para os clientes. Em pouco tempo todo mundo j\u00e1 estava usando.",
  },
  {
    avatar: "/testimonial-avatars/avatar-06.jpg",
    name: "Bruno Martins",
    handle: "@barbeariamartins",
    quote:
      "Ter os dados da opera\u00e7\u00e3o em um s\u00f3 lugar ajudou bastante nas decis\u00f5es do m\u00eas.",
  },
  {
    avatar: "/testimonial-avatars/avatar-07.jpg",
    name: "Lucas Nogueira",
    handle: "@donlucasbarber",
    quote:
      "Consigo organizar os hor\u00e1rios dos profissionais e evitar conflitos na agenda. Virou parte da nossa rotina.",
  },
  {
    avatar: "/testimonial-avatars/avatar-08.jpg",
    name: "Thiago Alves",
    handle: "@garagebarber",
    quote: "Bonito, r\u00e1pido e direto. Era o que a nossa barbearia precisava.",
  },
  {
    avatar: "/testimonial-avatars/avatar-09.jpg",
    name: "Gabriel Souza",
    handle: "@gabrielbarber",
    quote:
      "O link de agendamento facilitou muito. Os clientes escolhem o melhor hor\u00e1rio e a equipe recebe tudo organizado.",
  },
  {
    avatar: "/testimonial-avatars/avatar-10.jpg",
    name: "Diego Rocha",
    handle: "@rocha33",
    quote: "Recomendo para quem quer profissionalizar a gest\u00e3o sem complica\u00e7\u00e3o.",
  },
]

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.pageGrid} aria-hidden="true">
        <div className={styles.pageGridSide} />
        <div className={styles.pageGridFrame} />
        <div className={styles.pageGridSide} />
      </div>

      <header className={styles.landingHeader}>
        <div className={styles.landingHeaderInner}>
          <Link
            href="/"
            className={styles.landingBrand}
            aria-label={"R\u00e9gua M\u00e1xima"}
          >
            <Image
              src="/LogoMComBorder3.png"
              alt={"R\u00e9gua M\u00e1xima"}
              width={92}
              height={60}
              priority
            />
          </Link>

          <nav
            className={styles.landingNav}
            aria-label={"Navega\u00e7\u00e3o principal"}
          >
            <div className={styles.navDropdown}>
              <button className={styles.navTrigger} type="button">
                Produtos
                <ChevronDown aria-hidden="true" />
              </button>
              <div className={styles.megaMenu}>
                {productMenuItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <Link key={item.title} href={item.href} className={styles.megaMenuItem}>
                      <span className={styles.megaMenuIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <Link href="#como-funciona">Como funciona</Link>
            <Link href="#recursos">Recursos</Link>
            <Link href="#planos">Planos</Link>
            <Link href="/sobre">Sobre</Link>
          </nav>

          <Link href="/inicio" className={styles.headerButton}>
            <span>Acessar plataforma</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </header>

      <MotionSection className={styles.hero}>
        <div className={styles.heroWave} aria-hidden="true" />
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
          <h2>Cadastre sua barbearia em poucos passos</h2>
          <p>
            Configure as informações essenciais da sua operação e deixe
            tudo pronto para receber os primeiros agendamentos.
          </p>
        </div>

        <LandingRegistrationDemo />
      </MotionSection>

      <MotionSection className={styles.testimonialsSection} id="depoimentos">
        <div className={styles.testimonialsIntro}>
          <span>Hist\u00f3rias de quem usa</span>
          <h2>Feito para a rotina de quem vive a barbearia</h2>
        </div>

        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <MotionArticle
              className={styles.testimonialCardShell}
              delay={Math.min(index * 0.06, 0.42)}
              key={testimonial.handle}
            >
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialAvatar}>
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      width={46}
                      height={46}
                    />
                  </span>
                  <span>
                    <strong>{testimonial.name}</strong>
                    <small>{testimonial.handle}</small>
                  </span>
                </div>
                <p>{testimonial.quote}</p>
              </div>
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
