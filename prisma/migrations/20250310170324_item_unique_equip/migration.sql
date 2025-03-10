/*
  Warnings:

  - A unique constraint covering the columns `[userEquipped]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_userEquipped_key" ON "Item"("userEquipped");
