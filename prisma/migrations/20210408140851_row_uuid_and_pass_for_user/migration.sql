/*
  Warnings:

  - The primary key for the `Row` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Row` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `User` table. All the data in the column will be lost.
  - The required column `uuid` was added to the `Row` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Row" DROP CONSTRAINT "Row_pkey",
DROP COLUMN "id",
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uid",
ADD COLUMN     "password" TEXT NOT NULL;
