/*
  Warnings:

  - Made the column `ownerId` on table `Barbershop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Barbershop" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
