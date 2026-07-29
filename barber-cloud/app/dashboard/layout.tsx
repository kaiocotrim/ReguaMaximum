import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/_lib/prisma";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/dashboardComponents/AppSidebar";
import { PlanLicenseStatus } from "@/app/generated/prisma/client";
import { isLicenseAdminAccount } from "@/app/_lib/license-admin";

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
  const [barbershop, currentUser] = await Promise.all([
    db.barbershop.findFirst({
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
        licenses: {
          select: {
            status: true,
            expiresAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        isLicenseAdmin: true,
      },
    }),
  ]);

  // Caso o usuário ainda não tenha criado uma barbearia
  if (!barbershop) {
    redirect("/minha-barbearia");
  }

  const hasLicenseHistory = barbershop.licenses.length > 0
  const hasActiveLicense = barbershop.licenses.some(
    (license) =>
      license.status === PlanLicenseStatus.ACTIVE &&
      Boolean(license.expiresAt && license.expiresAt > new Date()),
  )

  if (hasLicenseHistory && !hasActiveLicense) {
    redirect("/minha-barbearia")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          user={{
            id: session.user.id,
            name: currentUser?.name ?? session.user.name,
            email: currentUser?.email ?? session.user.email,
            image: currentUser?.image ?? session.user.image,
          }}
          barbershop={barbershop}
          isLicenseAdmin={
            currentUser
              ? isLicenseAdminAccount(currentUser)
              : false
          }
        />

        <main className="flex-1 p-6">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
