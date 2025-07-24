/*
  Warnings:

  - You are about to drop the column `doc_url` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "doc_url",
ADD COLUMN     "ai_summary" TEXT;
