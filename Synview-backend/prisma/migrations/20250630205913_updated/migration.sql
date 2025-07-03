/*
  Warnings:

  - The primary key for the `User_Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[UserId,ProjectId]` on the table `User_Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User_Project" DROP CONSTRAINT "User_Project_pkey",
ADD COLUMN     "User_Project" SERIAL NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "User_Project_pkey" PRIMARY KEY ("User_Project");

-- CreateIndex
CREATE UNIQUE INDEX "User_Project_UserId_ProjectId_key" ON "User_Project"("UserId", "ProjectId");
