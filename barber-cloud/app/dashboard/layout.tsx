import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/_lib/prisma";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/dashboardComponents/AppSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica se o usuário está autenticado
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Busca apenas os dados necessários da barbearia
  const barbershop = await db.barbershop.findFirst({
    where: {
      ownerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      cidade: true,
      corMarca: true,
      instagram: true,
    },
  });

  // Caso o usuário ainda não tenha criado uma barbearia
  if (!barbershop) {
    redirect("/criar-barbearia");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
          barbershop={barbershop}
        />

        <main className="flex-1 p-6">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}