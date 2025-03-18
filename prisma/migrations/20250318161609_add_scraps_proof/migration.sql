-- CreateTable
CREATE TABLE "Scrap" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "battleId" INTEGER NOT NULL,

    CONSTRAINT "Scrap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Scrap" ADD CONSTRAINT "Scrap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scrap" ADD CONSTRAINT "Scrap_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
