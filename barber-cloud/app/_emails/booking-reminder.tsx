import { Html, Text, Heading, Section, Hr } from "@react-email/components"

interface BookingReminderProps {
  userName: string
  barbershopName: string
  serviceName: string
  barberName: string
  date: string
  time: string
}

export const BookingReminderEmail = ({
  userName,
  barbershopName,
  serviceName,
  barberName,
  date,
  time,
}: BookingReminderProps) => (
  <Html>
    <Section style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <Heading>Lembrete de Agendamento 💈</Heading>
      <Text>Olá, {userName}!</Text>
      <Text>Seu agendamento está confirmado:</Text>
      <Hr />
      <Text>🏠 Barbearia: <strong>{barbershopName}</strong></Text>
      <Text>✂️ Serviço: <strong>{serviceName}</strong></Text>
      <Text>👤 Barbeiro: <strong>{barberName}</strong></Text>
      <Text>📅 Data: <strong>{date}</strong></Text>
      <Text>🕐 Horário: <strong>{time}</strong></Text>
      <Hr />
      <Text>Até logo!</Text>
    </Section>
  </Html>
)