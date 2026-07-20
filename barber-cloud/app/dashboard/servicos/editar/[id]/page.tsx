import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  console.log(session);

  return (
    <div>
      <h1>Serviços</h1>
    </div>
  );
}