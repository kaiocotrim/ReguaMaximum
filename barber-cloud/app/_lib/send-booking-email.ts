// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// export const sendBookingEmail = async (data: {
//   toEmail: string
//   userName: string
//   barbershopName: string
//   serviceName: string
//   barberName: string
//   date: string
//   time: string
// }) => {
//   await resend.emails.send({
//     from: "Equipe RegumaXima <equipe@cotrimdev.com.br>",
//     to: data.toEmail,
//     subject: "Lembrete do seu agendamento 💈",
//     html: `
//   <div style="font-family: Arial, sans-serif; background: #0f0f0f; max-width: 520px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #C3F32C;">

//     <div style="background: #C3F32C; padding: 28px 32px;">
//       <p style="margin: 0; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #1a2e00; text-transform: uppercase;">Confirmação de agendamento</p>
//       <p style="margin: 6px 0 0; font-size: 22px; color: #0f0f0f;">Tudo certo por aqui</p>
//     </div>

//     <div style="padding: 32px;">
//       <p style="margin: 0 0 4px; font-size: 13px; color: #888;">Olá,</p>
//       <p style="margin: 0 0 24px; font-size: 15px; color: #ffffff; font-weight: bold;">${data.userName}</p>

//       <p style="margin: 0 0 20px; font-size: 13px; color: #888; line-height: 1.6;">
//         Seu agendamento foi confirmado. Veja os detalhes abaixo e nos vemos em breve.
//       </p>

//       <table style="width: 100%; border-collapse: collapse; background: #1a1a1a; border-radius: 10px; overflow: hidden;">
//         <tr style="border-bottom: 1px solid #2a2a2a;">
//           <td style="padding: 16px 20px; font-size: 12px; color: #666;">Barbearia</td>
//           <td style="padding: 16px 20px; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">${data.barbershopName}</td>
//         </tr>
//         <tr style="border-bottom: 1px solid #2a2a2a;">
//           <td style="padding: 16px 20px; font-size: 12px; color: #666;">Serviço</td>
//           <td style="padding: 16px 20px; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">${data.serviceName}</td>
//         </tr>
//         <tr style="border-bottom: 1px solid #2a2a2a;">
//           <td style="padding: 16px 20px; font-size: 12px; color: #666;">Barbeiro</td>
//           <td style="padding: 16px 20px; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">${data.barberName}</td>
//         </tr>
//         <tr style="border-bottom: 1px solid #2a2a2a;">
//           <td style="padding: 16px 20px; font-size: 12px; color: #666;">Data</td>
//           <td style="padding: 16px 20px; font-size: 13px; color: #C3F32C; font-weight: bold; text-align: right;">${data.date}</td>
//         </tr>
//         <tr>
//           <td style="padding: 16px 20px; font-size: 12px; color: #666;">Horário</td>
//           <td style="padding: 16px 20px; font-size: 13px; color: #C3F32C; font-weight: bold; text-align: right;">${data.time}</td>
//         </tr>
//       </table>

//       <p style="margin: 24px 0 0; font-size: 12px; color: #555; text-align: center; line-height: 1.6;">
//         Se precisar cancelar ou reagendar, entre em contato com a barbearia.
//       </p>

//       <div style="text-align: center; padding-top: 16px; margin-top: 16px; border-top: 1px solid #1e1e1e;">
//         <p style="margin: 0; font-size: 11px; color: #444;">
//           Você recebeu este e-mail porque realizou um agendamento.
//         </p>
//       </div>
//     </div>

//   </div>
// `,

//   })
// }
import { Resend } from "resend"

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
  const { data: result, error } = await resend.emails.send({
    from: "Equipe RegumaMaxima <equipe@cotrimdev.com.br>",
    to: data.toEmail,
    subject: "Lembrete do seu agendamento 💈",
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
</head>
<body style="margin: 0; padding: 0; background-color: #0f0f0f;">

  <div class="email-wrapper" style="background-color: #0f0f0f; padding: 32px 16px;">
    <div class="email-body" style="font-family: Arial, sans-serif; background-color: #0f0f0f; max-width: 520px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #C3F32C;">

      <div style="background: #C3F32C; padding: 28px 32px; text-align: center;">
        <!-- ✅ Substitua pela URL pública da sua logo (hospedada no seu servidor, S3, Cloudinary, etc.) -->
        <p style="margin: 0; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #1a2e00; text-transform: uppercase;">Confirmação de agendamento</p>
        <p style="margin: 6px 0 0; font-size: 22px; color: #0f0f0f; font-weight: bold;">Tudo certo por aqui ✓</p>
      </div>

      <div style="padding: 32px; background-color: #0f0f0f;">
        <p style="margin: 0 0 4px; font-size: 13px; color: #888888;">Olá,</p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #ffffff; font-weight: bold;">${data.userName}</p>

        <p style="margin: 0 0 20px; font-size: 13px; color: #888888; line-height: 1.6;">
          Seu agendamento foi confirmado. Veja os detalhes abaixo e nos vemos em breve.
        </p>

        <table class="details-table" style="width: 100%; border-collapse: collapse; background-color: #1a1a1a; border-radius: 10px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 16px 20px; font-size: 12px; color: #666666;">Barbearia</td>
            <td style="padding: 16px 20px; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">${data.barbershopName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 16px 20px; font-size: 12px; color: #666666;">Serviço</td>
            <td style="padding: 16px 20px; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">${data.serviceName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 16px 20px; font-size: 12px; color: #666666;">Barbeiro</td>
            <td style="padding: 16px 20px; font-size: 13px; color: #ffffff; font-weight: bold; text-align: right;">${data.barberName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="padding: 16px 20px; font-size: 12px; color: #666666;">Data</td>
            <td style="padding: 16px 20px; font-size: 13px; color: #C3F32C; font-weight: bold; text-align: right;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 16px 20px; font-size: 12px; color: #666666;">Horário</td>
            <td style="padding: 16px 20px; font-size: 13px; color: #C3F32C; font-weight: bold; text-align: right;">${data.time}</td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 12px; color: #555555; text-align: center; line-height: 1.6;">
          Se precisar cancelar ou reagendar, entre em contato com a barbearia.
        </p>

        <div style="text-align: center; padding-top: 16px; margin-top: 16px; border-top: 1px solid #1e1e1e;">
          <p style="margin: 0; font-size: 11px; color: #444444;">
            Você recebeu este e-mail porque realizou um agendamento.
          </p>
        </div>
      </div>

    </div>
  </div>

</body>
</html>
`,
  })

  if (error) {
    console.error("Erro ao enviar email:", error)
    throw new Error(error.message)
  }

  return result
}