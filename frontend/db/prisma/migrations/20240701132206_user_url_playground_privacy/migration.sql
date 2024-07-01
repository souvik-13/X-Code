/*
  Warnings:

  - Added the required column `private` to the `Playground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playground" ADD COLUMN     "private" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
