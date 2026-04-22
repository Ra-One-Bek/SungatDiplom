-- CreateTable
CREATE TABLE "AdminPlayer" (
    "id" SERIAL NOT NULL,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "age" INTEGER,
    "number" INTEGER,
    "position" TEXT NOT NULL,
    "nationality" TEXT,
    "photo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerOverride" (
    "id" SERIAL NOT NULL,
    "externalPlayerId" INTEGER NOT NULL,
    "clubId" TEXT NOT NULL,
    "customName" TEXT,
    "customNumber" INTEGER,
    "customPosition" TEXT,
    "customNationality" TEXT,
    "customPhoto" TEXT,
    "note" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminPlayer_clubId_idx" ON "AdminPlayer"("clubId");

-- CreateIndex
CREATE INDEX "PlayerOverride_clubId_idx" ON "PlayerOverride"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerOverride_externalPlayerId_clubId_key" ON "PlayerOverride"("externalPlayerId", "clubId");

-- AddForeignKey
ALTER TABLE "AdminPlayer" ADD CONSTRAINT "AdminPlayer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOverride" ADD CONSTRAINT "PlayerOverride_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
