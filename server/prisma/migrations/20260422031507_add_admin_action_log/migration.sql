-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('CREATE_LOCAL_PLAYER', 'UPDATE_LOCAL_PLAYER', 'DEACTIVATE_LOCAL_PLAYER', 'RESTORE_LOCAL_PLAYER', 'UPSERT_PLAYER_OVERRIDE', 'UPDATE_USER_ROLE');

-- CreateTable
CREATE TABLE "AdminActionLog" (
    "id" SERIAL NOT NULL,
    "adminUserId" INTEGER NOT NULL,
    "actionType" "AdminActionType" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "message" TEXT,
    "payloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminActionLog_adminUserId_idx" ON "AdminActionLog"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminActionLog_actionType_idx" ON "AdminActionLog"("actionType");

-- CreateIndex
CREATE INDEX "AdminActionLog_entityType_entityId_idx" ON "AdminActionLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "AdminActionLog" ADD CONSTRAINT "AdminActionLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
