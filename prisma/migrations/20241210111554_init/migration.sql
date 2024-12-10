/*
  Warnings:

  - A unique constraint covering the columns `[address,networkId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_address_networkId_key" ON "Token"("address", "networkId");
