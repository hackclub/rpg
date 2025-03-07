-- AlterTable
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken");

-- DropIndex
DROP INDEX "Session_sessionToken_key";
