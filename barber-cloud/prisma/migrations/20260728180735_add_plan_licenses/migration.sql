-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PlanLicenseStatus" AS ENUM ('AVAILABLE', 'CLAIMED', 'ACTIVE', 'REVOKED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isLicenseAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "plan_licenses" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codePreview" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "status" "PlanLicenseStatus" NOT NULL DEFAULT 'AVAILABLE',
    "customerName" TEXT,
    "customerPhone" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "claimedById" TEXT,
    "barbershopId" TEXT,
    "claimedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_licenses_codeHash_key" ON "plan_licenses"("codeHash");

-- CreateIndex
CREATE INDEX "plan_licenses_status_createdAt_idx" ON "plan_licenses"("status", "createdAt");

-- CreateIndex
CREATE INDEX "plan_licenses_claimedById_status_idx" ON "plan_licenses"("claimedById", "status");

-- CreateIndex
CREATE INDEX "plan_licenses_barbershopId_status_expiresAt_idx" ON "plan_licenses"("barbershopId", "status", "expiresAt");

-- AddForeignKey
ALTER TABLE "plan_licenses" ADD CONSTRAINT "plan_licenses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_licenses" ADD CONSTRAINT "plan_licenses_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_licenses" ADD CONSTRAINT "plan_licenses_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
