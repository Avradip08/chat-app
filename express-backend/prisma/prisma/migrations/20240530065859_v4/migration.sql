-- AlterTable
ALTER TABLE "UserToRoom" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "active" SET DEFAULT false;
