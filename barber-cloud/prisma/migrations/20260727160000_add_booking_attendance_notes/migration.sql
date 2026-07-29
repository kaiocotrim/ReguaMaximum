CREATE TYPE "BookingAttendance" AS ENUM ('PENDENTE', 'COMPARECEU', 'FALTOU');

ALTER TABLE "Booking"
ADD COLUMN "attendance" "BookingAttendance" NOT NULL DEFAULT 'PENDENTE',
ADD COLUMN "notes" TEXT;
