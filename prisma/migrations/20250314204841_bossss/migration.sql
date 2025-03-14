-- DropForeignKey
ALTER TABLE "Boss" DROP CONSTRAINT "Boss_userId_fkey";

-- AlterTable
ALTER TABLE "Boss" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Boss" ADD CONSTRAINT "Boss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
