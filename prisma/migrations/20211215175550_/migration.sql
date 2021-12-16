/*
  Warnings:

  - You are about to drop the `IShortOpportunity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Short" DROP CONSTRAINT "Short_shortOportunityId_fkey";

-- DropTable
DROP TABLE "IShortOpportunity";

-- CreateTable
CREATE TABLE "ShortOpportunity" (
    "id" TEXT NOT NULL,
    "initialPrice" TEXT NOT NULL,
    "finalPrice" TEXT NOT NULL,
    "highPercentage" TEXT NOT NULL,
    "gainTime" TIMESTAMP(3)[],
    "gainPercentage" TEXT[],
    "symbol" TEXT NOT NULL,

    CONSTRAINT "ShortOpportunity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Short" ADD CONSTRAINT "Short_shortOportunityId_fkey" FOREIGN KEY ("shortOportunityId") REFERENCES "ShortOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
