/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LowVoltageSpec` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTranslation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CableFamilyType" AS ENUM ('LOW_VOLTAGE_POWER', 'AERIAL', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "ConductorMaterial" AS ENUM ('COPPER', 'ALUMINUM', 'COPPER_OR_ALUMINUM');

-- CreateEnum
CREATE TYPE "CableConfig" AS ENUM ('SINGLE_CORE', 'MULTI_CORE_ROUND', 'MULTI_CORE_SECTOR');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'SENT', 'REJECTED');

-- DropForeignKey
ALTER TABLE "LowVoltageSpec" DROP CONSTRAINT "LowVoltageSpec_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTranslation" DROP CONSTRAINT "ProductTranslation_productId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "LowVoltageSpec";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductTranslation";

-- DropEnum
DROP TYPE "CableType";

-- CreateTable
CREATE TABLE "CableFamily" (
    "id" SERIAL NOT NULL,
    "type" "CableFamilyType" NOT NULL,

    CONSTRAINT "CableFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CableFamilyTranslation" (
    "id" SERIAL NOT NULL,
    "familyId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CableFamilyTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CableProduct" (
    "id" SERIAL NOT NULL,
    "familyId" INTEGER NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "ratedVoltage" TEXT NOT NULL,
    "maxOperatingTemp" TEXT NOT NULL,
    "conductorMaterial" "ConductorMaterial" NOT NULL,
    "conductorClasses" TEXT[],
    "minSection" DOUBLE PRECISION NOT NULL,
    "maxSection" DOUBLE PRECISION NOT NULL,
    "configurations" "CableConfig"[],
    "singleCoreLayers" TEXT,
    "multiCoreRoundLayers" TEXT,
    "multiCoreSectorLayers" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CableProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CableProductTranslation" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CableProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasheetRequest" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "requestedSpec" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "lang" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DatasheetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CableFamily_type_key" ON "CableFamily"("type");

-- CreateIndex
CREATE UNIQUE INDEX "CableFamilyTranslation_familyId_language_key" ON "CableFamilyTranslation"("familyId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "CableProduct_abbreviation_key" ON "CableProduct"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "CableProductTranslation_productId_language_key" ON "CableProductTranslation"("productId", "language");

-- AddForeignKey
ALTER TABLE "CableFamilyTranslation" ADD CONSTRAINT "CableFamilyTranslation_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "CableFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableProduct" ADD CONSTRAINT "CableProduct_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "CableFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CableProductTranslation" ADD CONSTRAINT "CableProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CableProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasheetRequest" ADD CONSTRAINT "DatasheetRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "CableProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
