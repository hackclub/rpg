/*
  Warnings:

  - A unique constraint covering the columns `[userId,userEquipped]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_userEquipped_key";

-- CreateIndex
CREATE UNIQUE INDEX "Item_userId_userEquipped_key" ON "Item"("userId", "userEquipped");
