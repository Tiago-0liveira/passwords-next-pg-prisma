-- CreateEnum
CREATE TYPE "LogInPlatform" AS ENUM ('Google', 'Git', 'Facebook', 'Reddit', 'Discord');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "uid" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Row" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "site" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "logInWithPlatform" "LogInPlatform",
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Row" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
