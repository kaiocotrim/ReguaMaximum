import { db } from "@/app/_lib/prisma";

export default async function Agendados() {
  const appointments = await db.booking.findMany({
    include: {
      user: true,
      barber: true,
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <>
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <h2>{appointment.user.name}</h2>

          <p>{appointment.barber.nome}</p>

          <p>{appointment.service.name}</p>

          <p>{appointment.barbershop.name}</p>

          <p>{appointment.date.toLocaleString()}</p>
        </div>
      ))}
    </>
  );
}