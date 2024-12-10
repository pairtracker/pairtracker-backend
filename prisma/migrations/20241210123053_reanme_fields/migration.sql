/*
  Warnings:

  - You are about to drop the column `created_at` on the `AMM` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `AMM` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Network` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Network` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `PairDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `PairDetail` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SwapPair` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SwapPair` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `TransactionHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `TransactionHistory` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `PairDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AMM" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Network" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PairDetail" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SwapPair" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionHistory" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
