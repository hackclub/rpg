/*
  Warnings:

  - Added the required column `strength` to the `Boss` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weakness` to the `Boss` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boss" ADD COLUMN     "strength" TEXT NOT NULL,
ADD COLUMN     "weakness" TEXT NOT NULL;
