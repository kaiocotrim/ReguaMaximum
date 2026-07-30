import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import styles from "./sobre.module.css"

export const metadata: Metadata = {
  title: "Sobre a Régua Máxima",
  description:
    "Conheça a história e o propósito da Régua Máxima, o sistema de gestão para barbearias.",
}

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <Link href="/">
          <ArrowLeft aria-hidden="true" />
          Voltar
        </Link>
        <div>
          <Image
            src="/LogoMComBorder3.png"
            alt="Logo da Régua Máxima"
            width={52}
            height={34}
          />
          <strong>Régua Máxima</strong>
        </div>
      </div>

      <section className={styles.hero}>
        <span>Nossa história</span>
        <h1>Sobre a Régua Máxima</h1>
        <p>
          Tecnologia criada para aproximar barbearias e clientes, simplificar a
          rotina profissional e transformar gestão em crescimento sustentável.
        </p>
      </section>

      <section className={styles.story}>
        <div>
          <span>Como começamos</span>
          <h2>Uma ideia nascida da rotina real</h2>
        </div>
        <div>
          <p>
            A Régua Máxima nasceu da observação de um desafio comum: excelentes
            profissionais ainda perdiam tempo organizando horários, clientes,
            equipe e finanças em ferramentas separadas.
          </p>
          <p>
            Criamos a Régua Máxima para reunir toda essa operação em um ambiente
            simples, confiável e fácil de usar. Cada recurso busca reduzir o
            trabalho manual e dar mais clareza ao dono da barbearia.
          </p>
          <p>
            Nosso compromisso é evoluir ao lado de quem vive o setor. A Régua
            Máxima continua sendo construída com atenção às necessidades de
            barbeiros, gestores e clientes.
          </p>
        </div>
      </section>

      <section className={styles.values}>
        {[
          ["01", "Simplicidade", "Recursos objetivos para facilitar o trabalho diário."],
          ["02", "Confiança", "Processos consistentes e informações protegidas."],
          ["03", "Crescimento", "Dados para tomar decisões melhores e crescer com controle."],
        ].map(([number, title, description]) => (
          <article key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className={styles.cta}>
        <h2>Conheça a Régua Máxima na prática</h2>
        <p>
          Organize sua barbearia e ofereça uma experiência melhor aos clientes.
        </p>
        <Link href="/login">
          Começar agora
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <footer>© 2026 Régua Máxima</footer>
    </main>
  )
}
