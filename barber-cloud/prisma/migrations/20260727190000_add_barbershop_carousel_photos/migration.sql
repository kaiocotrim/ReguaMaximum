CREATE TABLE "BarbershopPhoto" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BarbershopPhoto_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BarbershopPhoto_barbershopId_position_idx"
ON "BarbershopPhoto"("barbershopId", "position");

ALTER TABLE "BarbershopPhoto"
ADD CONSTRAINT "BarbershopPhoto_barbershopId_fkey"
FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
