/*
  Warnings:

  - Made the column `userId` on table `Boss` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Boss" DROP CONSTRAINT "Boss_userId_fkey";

-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "effect" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Boss" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Boss" ADD CONSTRAINT "Boss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
