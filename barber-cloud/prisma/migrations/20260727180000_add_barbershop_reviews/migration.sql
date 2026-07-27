CREATE TABLE "BarbershopReview" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarbershopReview_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BarbershopReview_rating_check" CHECK ("rating" >= 0 AND "rating" <= 5)
);

CREATE UNIQUE INDEX "BarbershopReview_bookingId_key" ON "BarbershopReview"("bookingId");
CREATE INDEX "BarbershopReview_barbershopId_idx" ON "BarbershopReview"("barbershopId");

ALTER TABLE "BarbershopReview"
ADD CONSTRAINT "BarbershopReview_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BarbershopReview"
ADD CONSTRAINT "BarbershopReview_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BarbershopReview"
ADD CONSTRAINT "BarbershopReview_barbershopId_fkey"
FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
