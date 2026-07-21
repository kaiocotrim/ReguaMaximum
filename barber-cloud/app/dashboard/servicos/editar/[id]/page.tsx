import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  return (
    <pre>
      {JSON.stringify(session, null, 2)}
    </pre>
  );
}