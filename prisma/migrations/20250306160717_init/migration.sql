-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "slack_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "treasure" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boss" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "health" TEXT NOT NULL,

    CONSTRAINT "Boss_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_slack_id_key" ON "User"("slack_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
