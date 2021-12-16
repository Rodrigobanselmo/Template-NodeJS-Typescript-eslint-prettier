/*
  Warnings:

  - The primary key for the `Price` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Price` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Price" DROP CONSTRAINT "Price_pkey",
DROP COLUMN "id",
DROP COLUMN "password",
ALTER COLUMN "time" DROP DEFAULT,
ADD CONSTRAINT "Price_pkey" PRIMARY KEY ("time");
