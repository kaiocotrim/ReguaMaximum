CREATE TABLE "BarberPortfolioPhoto" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BarberPortfolioPhoto_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BarberPortfolioPhoto_barberId_position_idx"
ON "BarberPortfolioPhoto"("barberId", "position");

ALTER TABLE "BarberPortfolioPhoto"
ADD CONSTRAINT "BarberPortfolioPhoto_barberId_fkey"
FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
