/*
  Warnings:

  - Added the required column `duration` to the `BarbeshopService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BarbeshopService" ADD COLUMN     "duration" INTEGER NOT NULL;
