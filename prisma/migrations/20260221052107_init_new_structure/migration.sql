/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `datasheet` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Product` table. All the data in the column will be lost.
  - Added the required column `abbreviation` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cableType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conductorStructure` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxOperatingTemp` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratedVoltage` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standard` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FA', 'EN', 'AR');

-- CreateEnum
CREATE TYPE "CableType" AS ENUM ('LOW_VOLTAGE_POWER', 'AERIAL', 'FLEXIBLE');

-- DropIndex
DROP INDEX "Product_slug_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "datasheet",
DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "abbreviation" TEXT NOT NULL,
ADD COLUMN     "cableType" "CableType" NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "conductorStructure" TEXT NOT NULL,
ADD COLUMN     "maxOperatingTemp" TEXT NOT NULL,
ADD COLUMN     "ratedVoltage" TEXT NOT NULL,
ADD COLUMN     "standard" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTranslation" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "usage" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LowVoltageSpec" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "singleCoreLayers" TEXT NOT NULL,
    "multiCoreRoundLayers" TEXT NOT NULL,
    "multiCoreSectorLayers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LowVoltageSpec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_language_key" ON "ProductTranslation"("productId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "LowVoltageSpec_productId_key" ON "LowVoltageSpec"("productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LowVoltageSpec" ADD CONSTRAINT "LowVoltageSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
