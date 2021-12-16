/*
  Warnings:

  - Added the required column `baseAssetVolume` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `close` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeTime` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `high` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `low` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `open` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteAssetVolume` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trades` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "baseAssetVolume" TEXT NOT NULL,
ADD COLUMN     "close" TEXT NOT NULL,
ADD COLUMN     "closeTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "high" TEXT NOT NULL,
ADD COLUMN     "low" TEXT NOT NULL,
ADD COLUMN     "open" TEXT NOT NULL,
ADD COLUMN     "openTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quoteAssetVolume" TEXT NOT NULL,
ADD COLUMN     "trades" INTEGER NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL;
