CREATE TABLE "BarberServiceConfig" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customPrice" DECIMAL(10,2),
    "customDuration" INTEGER,
    CONSTRAINT "BarberServiceConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FavoriteBarber" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FavoriteBarber_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "bookingId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BarberServiceConfig_barberId_serviceId_key"
ON "BarberServiceConfig"("barberId", "serviceId");
CREATE INDEX "BarberServiceConfig_serviceId_idx"
ON "BarberServiceConfig"("serviceId");
CREATE UNIQUE INDEX "FavoriteBarber_userId_barberId_key"
ON "FavoriteBarber"("userId", "barberId");
CREATE INDEX "FavoriteBarber_barberId_idx" ON "FavoriteBarber"("barberId");
CREATE INDEX "UserNotification_userId_createdAt_idx"
ON "UserNotification"("userId", "createdAt");
CREATE INDEX "AuditLog_barbershopId_createdAt_idx"
ON "AuditLog"("barbershopId", "createdAt");
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

ALTER TABLE "BarberServiceConfig"
ADD CONSTRAINT "BarberServiceConfig_barberId_fkey"
FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BarberServiceConfig"
ADD CONSTRAINT "BarberServiceConfig_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "BarbeshopService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FavoriteBarber"
ADD CONSTRAINT "FavoriteBarber_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FavoriteBarber"
ADD CONSTRAINT "FavoriteBarber_barberId_fkey"
FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserNotification"
ADD CONSTRAINT "UserNotification_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_barbershopId_fkey"
FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
