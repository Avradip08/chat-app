-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserToRoom" ADD COLUMN     "lastSeenTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
