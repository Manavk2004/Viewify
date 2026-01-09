-- CreateEnum
CREATE TYPE "theStatus" AS ENUM ('Active', 'Draft');

-- CreateTable
CREATE TABLE "Products" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "theStatus" NOT NULL,
    "price" TEXT NOT NULL,
    "compareAtPrice" INTEGER NOT NULL,
    "Sku" TEXT,
    "trackInventory" BOOLEAN NOT NULL,
    "Inventory" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Tags" TEXT,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);
