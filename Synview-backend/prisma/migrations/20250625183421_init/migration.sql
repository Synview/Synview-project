-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MENTOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "UserId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserId")
);

-- CreateTable
CREATE TABLE "Project" (
    "ProjectId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "repo_url" TEXT NOT NULL,
    "doc_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("ProjectId")
);

-- CreateTable
CREATE TABLE "User_Project" (
    "ProjectId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "User_Project_pkey" PRIMARY KEY ("UserId","ProjectId")
);

-- CreateTable
CREATE TABLE "Update" (
    "UpdateId" SERIAL NOT NULL,
    "Comments" TEXT NOT NULL,
    "summary" TEXT,
    "code_changes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    "ProjectId" INTEGER NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("UpdateId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "CommentId" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("CommentId")
);

-- CreateTable
CREATE TABLE "Question" (
    "QuestionId" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ProjectId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("QuestionId")
);

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "QuestionResponseId" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "QuestionId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("QuestionResponseId")
);

-- CreateTable
CREATE TABLE "Goal" (
    "GoalId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "ProjectId" INTEGER NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("GoalId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "NotificationId" SERIAL NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("NotificationId")
);

-- AddForeignKey
ALTER TABLE "User_Project" ADD CONSTRAINT "User_Project_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Project" ADD CONSTRAINT "User_Project_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("ProjectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("ProjectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_UpdateId_fkey" FOREIGN KEY ("UpdateId") REFERENCES "Update"("UpdateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("ProjectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("UserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_QuestionId_fkey" FOREIGN KEY ("QuestionId") REFERENCES "Question"("QuestionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("ProjectId") ON DELETE RESTRICT ON UPDATE CASCADE;
