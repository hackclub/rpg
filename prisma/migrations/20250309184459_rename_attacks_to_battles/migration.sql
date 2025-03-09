/*
  Warnings:

  - You are about to drop the column `attacking` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Attack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attack" DROP CONSTRAINT "Attack_userId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "attacking",
ADD COLUMN     "battling" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Attack";

-- CreateTable
CREATE TABLE "Battle" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
