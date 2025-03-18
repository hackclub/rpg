/*
  Warnings:

  - Added the required column `userId` to the `Scrap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scrap" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Scrap" ADD CONSTRAINT "Scrap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
