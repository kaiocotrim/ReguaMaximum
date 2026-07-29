ALTER TABLE "Barber"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "jobTitle" TEXT NOT NULL DEFAULT 'Barbeiro';

CREATE TABLE "BarberWorkSchedule" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "BarberWorkSchedule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BarberWorkSchedule_barberId_weekday_key"
ON "BarberWorkSchedule"("barberId", "weekday");

CREATE INDEX "BarberWorkSchedule_barberId_idx"
ON "BarberWorkSchedule"("barberId");

ALTER TABLE "BarberWorkSchedule"
ADD CONSTRAINT "BarberWorkSchedule_barberId_fkey"
FOREIGN KEY ("barberId") REFERENCES "Barber"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
