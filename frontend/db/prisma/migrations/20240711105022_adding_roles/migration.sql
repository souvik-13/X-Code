/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannerImage" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "userName" SET NOT NULL;

-- CreateTable
CREATE TABLE "PlaygroundAccess" (
    "playgroundId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "PlaygroundAccess_pkey" PRIMARY KEY ("playgroundId","userId")
);

-- AddForeignKey
ALTER TABLE "PlaygroundAccess" ADD CONSTRAINT "PlaygroundAccess_playgroundId_fkey" FOREIGN KEY ("playgroundId") REFERENCES "Playground"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaygroundAccess" ADD CONSTRAINT "PlaygroundAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
