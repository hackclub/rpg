/*
  Warnings:

  - You are about to drop the `_ItemToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `Boss` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxHealth` to the `Boss` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `health` on the `Boss` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ItemToUser" DROP CONSTRAINT "_ItemToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToUser" DROP CONSTRAINT "_ItemToUser_B_fkey";

-- AlterTable
ALTER TABLE "Boss" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "maxHealth" INTEGER NOT NULL,
DROP COLUMN "health",
ADD COLUMN     "health" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ItemToUser";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
