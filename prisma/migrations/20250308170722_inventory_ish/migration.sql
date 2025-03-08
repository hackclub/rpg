/*
  Warnings:

  - You are about to drop the column `inventory` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "inventory";

-- CreateTable
CREATE TABLE "_ItemToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItemToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ItemToUser_B_index" ON "_ItemToUser"("B");

-- AddForeignKey
ALTER TABLE "_ItemToUser" ADD CONSTRAINT "_ItemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToUser" ADD CONSTRAINT "_ItemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
