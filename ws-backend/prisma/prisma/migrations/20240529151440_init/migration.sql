/*
  Warnings:

  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateTable
CREATE TABLE "UserToRoom" (
    "userName" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "UserToRoom_pkey" PRIMARY KEY ("userName","roomId")
);

-- AddForeignKey
ALTER TABLE "UserToRoom" ADD CONSTRAINT "UserToRoom_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToRoom" ADD CONSTRAINT "UserToRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
