-- CreateTable
CREATE TABLE "IShortOpportunity" (
    "id" TEXT NOT NULL,
    "initialPrice" TEXT NOT NULL,
    "finalPrice" TEXT NOT NULL,
    "highPercentage" TEXT NOT NULL,
    "gainTime" TIMESTAMP(3)[],
    "gainPercentage" TEXT[],
    "symbol" TEXT NOT NULL,

    CONSTRAINT "IShortOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Short" (
    "shortOportunityId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "actualPercentage" TEXT NOT NULL,

    CONSTRAINT "Short_pkey" PRIMARY KEY ("time")
);

-- AddForeignKey
ALTER TABLE "Short" ADD CONSTRAINT "Short_shortOportunityId_fkey" FOREIGN KEY ("shortOportunityId") REFERENCES "IShortOpportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
