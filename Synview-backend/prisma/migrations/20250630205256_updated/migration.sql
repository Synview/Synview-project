/*
  Warnings:

  - Added the required column `role` to the `User_Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectRoles" AS ENUM ('CREATOR', 'VIEWER', 'REVIEWER');

-- AlterTable
ALTER TABLE "User_Project" ADD COLUMN     "role" "ProjectRoles" NOT NULL;
