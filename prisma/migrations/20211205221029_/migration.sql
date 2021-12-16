/*
  Warnings:

  - Added the required column `par` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "par" TEXT NOT NULL;
