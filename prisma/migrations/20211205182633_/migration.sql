-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);
