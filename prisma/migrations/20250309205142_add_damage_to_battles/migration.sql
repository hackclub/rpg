/*
  Warnings:

  - Added the required column `bossId` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `damage` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "bossId" INTEGER NOT NULL,
ADD COLUMN     "damage" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
