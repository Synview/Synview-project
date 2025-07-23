/*
  Warnings:

  - A unique constraint covering the columns `[sha]` on the table `updates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "updates_sha_key" ON "updates"("sha");
