-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'EM_ANDAMENTO';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "telefone" TEXT;
