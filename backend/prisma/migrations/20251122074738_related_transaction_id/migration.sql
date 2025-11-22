-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN "relatedTransactionId" INTEGER;

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN "relatedTransactionId" INTEGER;

-- AlterTable
ALTER TABLE "Repayment" ADD COLUMN "relatedTransactionId" INTEGER;

-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN "relatedTransactionId" INTEGER;
