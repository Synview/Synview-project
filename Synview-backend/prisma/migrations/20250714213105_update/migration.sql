/*
  Warnings:

  - The `status` column on the `goals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `role` on the `project_invitation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user_projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "roles" AS ENUM ('USER', 'MENTOR');

-- CreateEnum
CREATE TYPE "project_roles" AS ENUM ('CREATOR', 'VIEWER', 'REVIEWER');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "goals" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "project_invitation" DROP COLUMN "role",
ADD COLUMN     "role" "project_roles" NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "project_git_name" TEXT;

-- AlterTable
ALTER TABLE "user_projects" DROP COLUMN "role",
ADD COLUMN     "role" "project_roles" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "ProjectRoles";

-- DropEnum
DROP TYPE "Roles";

-- DropEnum
DROP TYPE "Status";
