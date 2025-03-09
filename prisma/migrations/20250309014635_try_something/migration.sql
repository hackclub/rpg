/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Attack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attack_userId_key" ON "Attack"("userId");
