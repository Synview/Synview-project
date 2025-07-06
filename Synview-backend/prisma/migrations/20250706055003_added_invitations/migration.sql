/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question_response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `update` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_project` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'MENTOR');

-- CreateEnum
CREATE TYPE "invitation_status" AS ENUM ('PENDING', 'COMPLETE');

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_update_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "goal" DROP CONSTRAINT "goal_project_id_fkey";

-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_update_id_fkey";

-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_user_id_fkey";

-- DropForeignKey
ALTER TABLE "question_response" DROP CONSTRAINT "question_response_question_id_fkey";

-- DropForeignKey
ALTER TABLE "question_response" DROP CONSTRAINT "question_response_user_id_fkey";

-- DropForeignKey
ALTER TABLE "update" DROP CONSTRAINT "update_project_id_fkey";

-- DropForeignKey
ALTER TABLE "update" DROP CONSTRAINT "update_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_project" DROP CONSTRAINT "user_project_project_id_fkey";

-- DropForeignKey
ALTER TABLE "user_project" DROP CONSTRAINT "user_project_user_id_fkey";

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "goal";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "question";

-- DropTable
DROP TABLE "question_response";

-- DropTable
DROP TABLE "update";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_project";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "project_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "repo_url" TEXT,
    "doc_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "user_projects" (
    "user_project" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "ProjectRoles" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_projects_pkey" PRIMARY KEY ("user_project")
);

-- CreateTable
CREATE TABLE "updates" (
    "update_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "code_changes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "updates_pkey" PRIMARY KEY ("update_id")
);

-- CreateTable
CREATE TABLE "comments" (
    "comment_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "question_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "question_responses" (
    "question_response_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "question_responses_pkey" PRIMARY KEY ("question_response_id")
);

-- CreateTable
CREATE TABLE "goals" (
    "goal_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("goal_id")
);

-- CreateTable
CREATE TABLE "project_invitation" (
    "project_invitation_id" SERIAL NOT NULL,
    "invited_project_id" INTEGER NOT NULL,
    "invited_user_id" INTEGER NOT NULL,
    "inviting_user_id" INTEGER NOT NULL,
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3) NOT NULL,
    "role" "ProjectRoles" NOT NULL,
    "status" "invitation_status" NOT NULL,

    CONSTRAINT "project_invitation_pkey" PRIMARY KEY ("project_invitation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_projects_user_id_project_id_key" ON "user_projects"("user_id", "project_id");

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "updates" ADD CONSTRAINT "updates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_update_id_fkey" FOREIGN KEY ("update_id") REFERENCES "updates"("update_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_update_id_fkey" FOREIGN KEY ("update_id") REFERENCES "updates"("update_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invitation" ADD CONSTRAINT "project_invitation_invited_project_id_fkey" FOREIGN KEY ("invited_project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invitation" ADD CONSTRAINT "project_invitation_inviting_user_id_fkey" FOREIGN KEY ("inviting_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invitation" ADD CONSTRAINT "project_invitation_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
