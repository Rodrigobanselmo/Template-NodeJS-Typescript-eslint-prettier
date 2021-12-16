/*
  Warnings:

  - The primary key for the `Candle` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Candle" DROP CONSTRAINT "Candle_pkey",
ADD CONSTRAINT "Candle_pkey" PRIMARY KEY ("openTime", "closeTime");

-- CreateTable
CREATE TABLE "Coin" (
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("symbol")
);

-- AddForeignKey
ALTER TABLE "Candle" ADD CONSTRAINT "Candle_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Coin"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
