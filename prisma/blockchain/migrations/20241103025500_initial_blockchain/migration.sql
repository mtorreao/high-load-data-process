-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "transaction_fee" TEXT NOT NULL,
    "symbol_from" TEXT NOT NULL,
    "symbol_to" TEXT NOT NULL,
    "amount_from" TEXT NOT NULL,
    "amount_to" TEXT NOT NULL,
    "address_from" TEXT NOT NULL,
    "address_to" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "status2" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_uuid_key" ON "transactions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_hash_key" ON "transactions"("transaction_hash");
