/*
  Warnings:

  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Price";

-- CreateTable
CREATE TABLE "Candle" (
    "symbol" TEXT NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL,
    "open" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "closeTime" TIMESTAMP(3) NOT NULL,
    "quoteAssetVolume" TEXT NOT NULL,
    "trades" INTEGER NOT NULL,
    "baseAssetVolume" TEXT NOT NULL,

    CONSTRAINT "Candle_pkey" PRIMARY KEY ("symbol","openTime","closeTime")
);
