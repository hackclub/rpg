/*
  Warnings:

  - The `inventory` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "inventory",
ADD COLUMN     "inventory" INTEGER[] DEFAULT ARRAY[1, 2]::INTEGER[];
