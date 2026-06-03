import { Resend } from "resend"
import { BookingReminderEmail } from "../_emails/booking-reminder"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendBookingEmail = async (data: {
  toEmail: string
  userName: string
  barbershopName: string
  serviceName: string
  barberName: string
  date: string
  time: string
}) => {
  await resend.emails.send({
    from: "Barbearia <noreply@seudominio.com>",
    to: data.toEmail,
    subject: "Lembrete do seu agendamento 💈",
    react: BookingReminderEmail(data),
  })
}