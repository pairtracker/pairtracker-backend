/*
  Warnings:

  - You are about to drop the column `contractAddress` on the `AMM` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AMM` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AMM` table. All the data in the column will be lost.
  - You are about to drop the column `chainId` on the `Network` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Network` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Network` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `decimals` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the `Pair` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `networkId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_ammId_fkey";

-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_token0Id_fkey";

-- DropForeignKey
ALTER TABLE "Pair" DROP CONSTRAINT "Pair_token1Id_fkey";

-- DropIndex
DROP INDEX "AMM_contractAddress_key";

-- DropIndex
DROP INDEX "AMM_name_key";

-- DropIndex
DROP INDEX "Network_chainId_key";

-- DropIndex
DROP INDEX "Token_address_key";

-- AlterTable
ALTER TABLE "AMM" DROP COLUMN "contractAddress",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Network" DROP COLUMN "chainId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "explorerUrl" TEXT,
ADD COLUMN     "rpcUrl" TEXT;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "createdAt",
DROP COLUMN "decimals",
DROP COLUMN "updatedAt",
ADD COLUMN     "networkId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pair";

-- CreateTable
CREATE TABLE "SwapPair" (
    "id" SERIAL NOT NULL,
    "token0Id" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,
    "ammId" INTEGER NOT NULL,
    "pairAddress" TEXT NOT NULL,

    CONSTRAINT "SwapPair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairDetail" (
    "id" SERIAL NOT NULL,
    "pairId" INTEGER NOT NULL,
    "reserveToken0" DOUBLE PRECISION NOT NULL,
    "reserveToken1" DOUBLE PRECISION NOT NULL,
    "feeTier" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PairDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" SERIAL NOT NULL,
    "pairId" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "amountIn" DOUBLE PRECISION NOT NULL,
    "amountOut" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PairDetail_pairId_key" ON "PairDetail"("pairId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapPair" ADD CONSTRAINT "SwapPair_ammId_fkey" FOREIGN KEY ("ammId") REFERENCES "AMM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapPair" ADD CONSTRAINT "SwapPair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwapPair" ADD CONSTRAINT "SwapPair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairDetail" ADD CONSTRAINT "PairDetail_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "SwapPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "SwapPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
