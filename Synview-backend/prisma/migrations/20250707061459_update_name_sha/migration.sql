/*
  Warnings:

  - You are about to drop the column `code_changes` on the `updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "updates" DROP COLUMN "code_changes",
ADD COLUMN     "sha" TEXT;
